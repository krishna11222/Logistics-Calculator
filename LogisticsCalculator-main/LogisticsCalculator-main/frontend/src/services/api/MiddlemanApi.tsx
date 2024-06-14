import ApiURL from '../../constants/ApiConfig';
import { MiddlemanDetails } from '../../models/middleman/MiddlemanDetails';
import { MiddlemanResponse } from '../../models/middleman/MiddlemanResponse';

const calculateMiddleman = async (data: MiddlemanDetails): Promise<MiddlemanResponse> => {
    const response = await fetch(`${ApiURL}/middleman`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorText = await response.text();
        throw new Error(`Error: ${response.statusText}, ${errorText}`);
    }
}

export default calculateMiddleman;