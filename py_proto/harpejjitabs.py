''' This is a quick prototype to generate harpejji fretboard diagrams.
This is mostly uncommented. See __main__ to see how to use it.
'''

import os
import attr
import svgwrite


@attr.s
class HarpejjiTab:

    filename = attr.ib()
    title = attr.ib(default="")
    strings = attr.ib(default=7)
    frets = attr.ib(default=3)
    base_note = attr.ib(default=0)
    fingers = attr.ib(default=attr.Factory(list))

    frets_spacing = attr.ib(default=60)
    string_spacing = attr.ib(default=30)
    padding = attr.ib(default=20)
    marker_width = attr.ib(default=15)
    marker_height = attr.ib(default=25)
    text_height = attr.ib(default=20)
    output_folder = attr.ib(default='svg_tabs')

    def __attrs_post_init__(self):

        self.total_width = self.strings * self.string_spacing + self.padding
        self.total_height = self.frets * self.frets_spacing + self.padding
        self.dwg = svgwrite.Drawing(
            os.path.join(self.output_folder, self.filename),
            profile="tiny",
            size=(self.total_width, self.total_height + 2 * self.text_height)
        )
        self.draw()

    def fret_y(self, n):
        return n * self.frets_spacing + self.padding

    def string_x(self, n):
        return n * self.string_spacing + self.padding

    def mark_note(self, s, f):

        f = self.frets - f - 1
        note = (self.base_note + f + 2 * s) % 12

        return note

    def place_finger(self, s, f, n, emph=False):

        f = self.frets - f - 1
        offset = self.frets_spacing / 8


        if emph:
            back = 'red'
            fore = 'black'
        else:
            back = "black"
            fore = "white"

        self.dwg.add(
            self.dwg.circle(
                (self.string_x(s), self.fret_y(f) + self.text_height / 1.5 + offset),
                self.text_height / 1.5,
                stroke="black",
                fill=back,
                opacity="1",
            )
        )

        self.dwg.add(
            self.dwg.text(
                f"{n}",
                insert=(self.string_x(s), self.fret_y(f) + self.text_height + offset),
                fill=fore,
                stroke=fore,
                text_anchor="middle",
                font_size=self.text_height,
            )
        )

    def draw_mark(self, s, f):

        note = self.mark_note(s, f)
        color = "#999" if note in [1, 3, 6, 8, 10] else "white"

        x = self.string_x(s)
        y = self.fret_y(f)

        self.dwg.add(
            self.dwg.rect(
                (x - self.marker_width / 2, y),
                (self.marker_width, self.marker_height),
                fill=color,
                stroke="#666",
            )
        )

        if note == 0:
            self.dwg.add(
                self.dwg.polyline(
                    (
                        (x, y),
                        (x - self.marker_width / 2, y + self.marker_height / 2),
                        (x, y + self.marker_height),
                        (x + self.marker_width / 2, y + self.marker_height / 2),
                        (x, y),
                    ),
                    stroke="black",
                    fill="white",
                )
            )

    def draw(self):

        for s in range(self.strings):
            for f in range(self.frets):
                self.draw_mark(s, f)

        for f in range(self.frets):
            height = self.fret_y(f)
            self.dwg.add(
                self.dwg.line((0, height), (self.total_width, height), stroke="#666")
            )

        for s in range(self.strings):
            width = self.string_x(s)
            self.dwg.add(
                self.dwg.line((width, 0), (width, self.total_height), stroke="#ccc")
            )

        for s, f, n, e in self.fingers:
            self.place_finger(s, f, n, e)

        self.dwg.add(
            self.dwg.text(
                self.title,
                insert=(self.total_width / 2, self.total_height + self.text_height,),
                fill="black",
                text_anchor="middle",
            )
        )

    def save(self):
        self.dwg.save()


if __name__ == '__main__':

    # Build a tablature and save it
    HarpejjiTab(
        filename="example.svg",
        title="Title",
        strings=7,
        frets=3,
        base_note=11, # bottom left note is a B
        fingers=(
            # format is 
            # (string number, fret number, finger, emphasize?)
            (0, 1, 2, True),
            (1, 1, 3, False),
            (2, 1, 4, False),
            (3, 0, 1, False),
            (3, 2, 2, False),
            (4, 2, 3, False),
            (5, 2, 4, False),
            (6, 1, 5, False),
        ),
    ).save()

