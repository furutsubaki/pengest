
import { error, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

/**
 * imageIdで画像を取得
 */
export const GET: RequestHandler = async (event) => {
    // 入力チェック
    const { params, setHeaders } = event;

    if (!params.imageId) {
        throw error(404, '画像が見つかりません');
    }

    const { data } = await axios(`/api/v1/images/${params.imageId}`);
    if (!data.data.id) {
        throw error(404, '画像が見つかりません');
    }

    const imageSrc = data.data.originalSrc;

    const file = await fetch(imageSrc)
        .then((response) => response.blob())
        .then((blob) => new File([blob], `${params.imageId}.webp`, { type: 'image/webp' }))
        .then((file) => file);

    setHeaders({
        'cache-control': 'max-age=3600',
    });

    return new Response(file, { status: 200 });
};
