({
    "showValueOnSelection": true
})

import { of, map, interval, take } from "rxjs";

of(1, 2, 3)
    .pipe(
        map((x) => x ** 2)
    )
    .subscribe((x) => console.log(x));
