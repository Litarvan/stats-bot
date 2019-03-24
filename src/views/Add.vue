<template>
    <div id="add">
        <h1 id="title">Adding a new guild</h1>

        <div id="images">
            <img class="image" src="../assets/add_1.png" />
            <img class="image" src="../assets/add_2.png" />
        </div>

        <p id="instructions">
            Click on the button below to open the Discord authorization request.
            Click on <b>Authorize</b> and fill the captcha, until you see the success icon.
            Close the tab, and go to your guild on the Discord client.
            <b>For best result, give the bot permissions to see all channels.</b> Now in any channel type <i>stats link</i>.
            Bot should start processing statistics, and a link to the result will be printed at the end.
        </p>

        <a target="_blank" href="https://discordapp.com/oauth2/authorize?client_id=558685772618661915&scope=bot">
            <button id="add-button">Add to your guild</button>
        </a>
    </div>
</template>

<script>
    export default {
        name: 'add'
    }
</script>

<style lang="scss" scoped>
    #add {
        display: flex;
        align-items: center;
        justify-content: center;

        flex-direction: column;

        height: 100vh;
    }

    #title {
        margin-top: -100px;
        margin-bottom: 30px;

        font-size: 48px;
        font-weight: 500;
    }

    #images {
        display: flex;

        .image {
            width: 425px;
            height: 250px;

            margin: 20px 35px;

            border-radius: 5px;
            box-shadow: rgba(0, 0, 0, 0.3) 0 1px 4px 0;
        }
    }

    #instructions {
        margin-top: 40px;
        margin-bottom: 50px;

        max-width: 800px;

        font-size: 18px;
        text-align: center;
    }

    #add-button {
        background-color: #7289da;
        color: #fff;

        transition: background-color.17s ease;

        border: none;
        outline: none;

        border-radius: 3px;

        font-family: 'Whitney', 'Arial', sans-serif;
        font-size: 14px;
        font-weight: 500;

        padding: 2px 16px;
        height: 32px;
        line-height: 16px;

        user-select: none;
        cursor: pointer;
    }

    #add-button:hover {
        background-color: #677bc4;
    }
</style>
