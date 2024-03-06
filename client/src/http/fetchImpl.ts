

const getFetch = async <T>(addr: string, headers: Record<string, any> = {}) => {
    return fetch(addr, {
        headers
    })
        .then(response => response.json())
        .then((data: T) => data);
};

const postFetch = async <T>(
    addr: string,
    headers: Record<string, any> = {},
    body?: BodyInit,
) => {
    return fetch(addr, {
        method: 'POST',
        headers,
        body,
    })
        .then((response) => response.json())
        .then((data: T) => data)
        .catch((error) => {
            console.log({error});
            return {success: false, message: 'Some error', ...error}
        });
}


export {
    getFetch,
    postFetch,
}