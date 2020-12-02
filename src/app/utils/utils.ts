import {ActivatedRoute, Params, Router} from "@angular/router";
import {fromPromise} from "rxjs/internal-compatibility";
import {Observable} from "rxjs";

export class Utils {
    private static navigationQueue = Promise.resolve(true);

    static clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    static formatPercent(value: any) {
        if (value === undefined) {
            return 'No Data';
        }

        return value.toFixed(2) + '%';
    }

    static updateQueryParameters(router: Router, activatedRoute: ActivatedRoute, queryParams: Params): Observable<boolean> {
        return fromPromise(Utils.navigationQueue = (async () => {
            await this.navigationQueue;

            return await router.navigate([], {
                relativeTo: activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // Don't remove other query parameters
            });
        })());
    }

    static getQueryParameterAndParse<T>(activatedRoute: ActivatedRoute, queryParam: string): T {
        const str = activatedRoute.snapshot.queryParams[queryParam];

        if (!str) {
            return undefined;
        }

        return JSON.parse(str);
    }

    static getQueryParameter(activatedRoute: ActivatedRoute, queryParam: string): string {
        const str = activatedRoute.snapshot.queryParams[queryParam];

        if (!str) {
            return undefined;
        }

        return str;
    }
}
