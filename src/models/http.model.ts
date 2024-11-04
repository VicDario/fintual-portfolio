type HttpQueryModelParams = {
    path: string;
    queryParams: Record<string, string> | undefined;
};

class HttpQueryModel {
    path: string;
    queryParams: URLSearchParams;

    constructor({ path, queryParams }: HttpQueryModelParams) {
        this.path = path;
        this.queryParams = new URLSearchParams(queryParams);
    }
}

export default HttpQueryModel;
