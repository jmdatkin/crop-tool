<template>
    <div class="toolbar border-bottom">
        <div class="toolbar-items">
            <div class="toolbar-item">
                <span>Crop Tool</span>
                <!-- <button>Button</button> -->
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
    .toolbar {
        width: 100%;
        height: $toolbar-height;
        padding: 5px 0;
    }

    .toolbar-items {
        display: flex;
        flex-direction: row;
        margin: 0 40px;
        place-items: center;
    }

    button {
        // color: #eee;
        color:  rgb(55, 59, 73);
        background-color: #eee;
        font-weight: 600;
        text-shadow: 1px 1px 0 rgb(167, 167, 167);
        // border: solid 2px rgb(76, 86, 119);
        padding: 2px 10px;
        border-radius: 8px;
        line-height: 200%;
        // vertical-align: middle;
    }

    span {
        font-weight: 700;
        font-size: 2rem;
        font-family: 'Roboto','Segoe UI', Tahoma, Geneva, Verdana, sans-serif
    }
</style>