<script lang="ts">
export let value: string;
export let maxLength = null as unknown as number;
export let placeholder: string;
export let rows = 1;

let textareaNode: HTMLTextAreaElement;

let initHeight = null as unknown as number;
$: if (textareaNode) {
    let lines = (value + '\n').match(/\n/g)?.length ?? 1;
    textareaHeightAutoChange(textareaNode, lines);
}
const textareaHeightAutoChange = (self: HTMLTextAreaElement, lines: number) => {
    const cssStyleDeclaration = getComputedStyle(self, null);
    if (!initHeight) {
        let height = parseInt(
            cssStyleDeclaration.getPropertyValue('height'),
            10,
        );
        initHeight = height;
    }
    let lineHeight = parseInt(
        cssStyleDeclaration.getPropertyValue('line-height'),
        10,
    );

    if (!lineHeight) {
        self.style.lineHeight = '1.5em';
        lineHeight = 1.5;
    }

    const minLines = rows;
    const initInnerPadding = initHeight - lineHeight;
    if (lines < minLines) {
        lines = minLines;
    }

    self.style.height = initInnerPadding + lineHeight * lines + 'px';
};
</script>

<div class="textarea-wrap">
    <div class="textarea-box">
        <textarea
            bind:this={textareaNode}
            bind:value
            class="textarea"
            {rows}
            style={`--rows: ${rows}`}
            on:keydown
            {...$$restProps}
            placeholder=" "
        />
        <div class="placeholder">{placeholder}</div>
    </div>
    {#if maxLength !== null}
        <TextCounter {value} {maxLength} />
    {/if}
</div>

<style lang="scss">
.textarea-wrap {
    width: 100%;
}

.textarea-box {
    position: relative;
    .textarea {
        width: 100%;
        height: 40px;
        padding: 0 8px;
        padding-top: 8px; // inputの内部高さ合わせ
        border: 0;
        border-bottom: 1px solid var(--color-theme-border);
        &:focus,
        &:not(:placeholder-shown) {
            padding-top: 12px;
            + .placeholder {
                font-size: var(--font-size-small);
                color: var(--color-theme-active);
                transform: translateY(0);
            }
        }
    }
    .placeholder {
        position: absolute;
        top: 0;
        left: 8px;
        display: flex;
        align-items: center;
        margin: auto 0;
        color: var(--color-theme-placeholder);
        pointer-events: none;
        transition: color 0.2s, transform 0.2s, font-size 0.2s;
        transform: translateY(10px);
    }
}
</style>
