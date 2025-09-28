import { API } from "./api";
import type { PendingResult } from "./pendingResult";

type UpdateFn = (result: PendingResult) => void;
type FetchInput = string | (Record<string, any> & { url: string });

const DEFAULT_WOO_API_URL = process.env.WC_API_BASE_URL ?? "https://meyashop.com/wp-json/wc/v3";
let wooApiUrl = DEFAULT_WOO_API_URL;
let hasWarnedMissingCredentials = false;

const isServer = typeof window === "undefined";

const ensureServer = () => {
    if (!isServer) {
        throw new Error("WooCommerceAPI is only available on the server.");
    }
};

export const setWooCommerceAPIUrl = (url: string) => {
    wooApiUrl = url;
};

export const getWooCommerceAPIUrl = () => {
    if (process?.env?.WC_API_BASE_URL) {
        return process.env.WC_API_BASE_URL;
    }
    return wooApiUrl;
};

const getWooCommerceCredentials = () => {
    ensureServer();

    const key = process.env.WC_KEY;
    const secret = process.env.WC_SECRET;

    if (!key || !secret) {
        if (!hasWarnedMissingCredentials) {
            console.warn("WooCommerce credentials missing. Define WC_KEY and WC_SECRET in the server environment.");
            hasWarnedMissingCredentials = true;
        }
        return undefined;
    }

    return { key, secret } as const;
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const normalizeWooUrl = (value: string) => {
    if (isAbsoluteUrl(value)) {
        return value;
    }

    const base = getWooCommerceAPIUrl().replace(/\/$/, "");
    const path = value.startsWith("/") ? value : `/${value}`;
    return `${base}${path}`;
};

const appendCredentials = (targetUrl: string) => {
    const credentials = getWooCommerceCredentials();
    if (!credentials) {
        return targetUrl;
    }

    try {
        const url = new URL(targetUrl);
        if (!url.searchParams.has("consumer_key")) {
            url.searchParams.set("consumer_key", credentials.key);
        }
        if (!url.searchParams.has("consumer_secret")) {
            url.searchParams.set("consumer_secret", credentials.secret);
        }
        return url.toString();
    } catch (error) {
        console.error("WooCommerceAPI: unable to append credentials", { targetUrl, error });
        return targetUrl;
    }
};

const prepareFetchInput = (urlOrData: FetchInput) => {
    ensureServer();

    if (typeof urlOrData === "string") {
        const url = normalizeWooUrl(urlOrData);
        return appendCredentials(url);
    }

    if (urlOrData && typeof urlOrData === "object" && "url" in urlOrData) {
        const credentials = getWooCommerceCredentials();
        const prepared: Record<string, any> & { url: string } = {
            ...urlOrData,
            url: normalizeWooUrl(urlOrData.url),
        };

        if (credentials) {
            if (!("consumer_key" in prepared)) {
                prepared.consumer_key = credentials.key;
            }
            if (!("consumer_secret" in prepared)) {
                prepared.consumer_secret = credentials.secret;
            }
        }

        return prepared;
    }

    return urlOrData;
};

const fetchWithWooCredentials = (
    urlOrData: FetchInput,
    data?: unknown,
    update?: UpdateFn,
    plain?: boolean,
    retryNum?: number
): Promise<PendingResult | undefined> => {
    const preparedInput = prepareFetchInput(urlOrData);
    return API.fetch(preparedInput, data, update, plain, retryNum);
};

export const WooCommerceAPI = {
    fetch: fetchWithWooCredentials,
    get: (url: string, update?: UpdateFn, plain?: boolean, retryNum?: number) =>
        fetchWithWooCredentials(url, undefined, update, plain, retryNum),
    post: (url: string, data: unknown, update?: UpdateFn, plain?: boolean, retryNum?: number) =>
        fetchWithWooCredentials(url, data, update, plain, retryNum),
};

export type WooCommerceAPIType = typeof WooCommerceAPI;
