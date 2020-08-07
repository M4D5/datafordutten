import {ActivatedRoute, Router} from "@angular/router";

export class Utils {
    static clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    static formatPercent(value: any) {
        if (value === undefined) {
            return 'No Data';
        }

        return value.toFixed(2) + '%';
    }

    static updateQueryParameters(router: Router, activatedRoute: ActivatedRoute, queryParams: any) {
        router.navigate([], {
            relativeTo: activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        }).then();
    }

    static getQueryParameterAndParse<T>(activatedRoute: ActivatedRoute, queryParam: string): T {
        const str = activatedRoute.snapshot.queryParams[queryParam];

        if (!str) {
            return undefined;
        }

        return JSON.parse(str);
    }
}
