    /**
     * Some public helper function used to modulo correctly with negative number
     * @param n
     * @param m
     * @returns {number}
     */
    window.mod = function(n, m) {
        return ((n % m) + m) % m;
    }