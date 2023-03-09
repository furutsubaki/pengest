<script lang="ts">
import { createEventDispatcher } from 'svelte';
import TideImageBox, {
    type TideImage,
    type TideImageOptions,
} from 'svelte-tide-image-box';

$: defaultOptions = {
    appendToNode: null as unknown as HTMLElement,
    canScrollNone: false,
} as TideImageOptions;

export let images: TideImage[];
export let options: TideImageOptions = defaultOptions;
export let isAspect = false;

$: createOptions = { ...defaultOptions, ...options };
const dispatch = createEventDispatcher();

const onOpen = ({ detail: image }: { detail: TideImage }) => {
    dispatch('open', image);
};
const onClose = () => {
    dispatch('close');
};
const onChange = ({ detail: image }: { detail: TideImage }) => {
    dispatch('change', image);
};
export let onCloseTrigger = () => {};
</script>

<TideImageBox
    {images}
    options={createOptions}
    on:open={(e) => onOpen(e)}
    on:close={(e) => onClose()}
    on:change={(e) => onChange(e)}
    let:tideImages
    let:onClick
    bind:onClose={onCloseTrigger}
>
    <div class="images {isAspect && `is-aspect count-${images.length}`}">
        {#each tideImages as image, i (i)}
            <a
                class="link"
                href={image.src}
                on:click={(e) => onClick(e, image)}
            >
                <img src={image.src} alt={image.alt} class="img" />
            </a>
        {/each}
    </div>
</TideImageBox>

<style lang="scss">
.images {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    width: fit-content;
    &.is-aspect {
        overflow: hidden;
        border-radius: 8px;
    }
    .img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        max-height: 300px;
        aspect-ratio: 1/1;
    }
    &.count-1 {
        .img {
            width: auto;
            max-width: 100%;
            max-height: 600px;
            aspect-ratio: initial;
        }
    }
    &.count-2 {
        grid-template-rows: auto;
        grid-template-columns: repeat(2, 1fr);
        .img {
            width: 100%;
        }
    }
    &.count-3 {
        grid-template:
            repeat(2, 1fr) auto 'a b'
            'a c';
        .link {
            .img {
                width: 100%;
                height: 100%;
                aspect-ratio: 2/1;
            }
            &:nth-child(1) {
                grid-area: a;
            }
            &:nth-child(2) {
                grid-area: b;
                .img {
                    max-height: 150px;
                }
            }
            &:nth-child(3) {
                grid-area: c;
                .img {
                    max-height: 150px;
                }
            }
        }
    }
    &.count-4 {
        grid-template:
            repeat(2, 1fr) auto 'a b'
            'c d';
        .link {
            .img {
                width: 100%;
                height: 100%;
                max-height: 150px;
                aspect-ratio: 2/1;
            }
            &:nth-child(1) {
                grid-area: a;
            }
            &:nth-child(2) {
                grid-area: b;
            }
            &:nth-child(3) {
                grid-area: c;
            }
            &:nth-child(4) {
                grid-area: d;
            }
        }
    }
}
</style>
