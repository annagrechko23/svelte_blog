<script>
  import Post from "./Post.svelte";

  import { startWith } from "rxjs/operators";
  import { collectionData, firestore } from "./../firebase";
  import firebase, { app } from "../firebase";
  import Button, { Label } from "@smui/button";
  import Card, {Content, PrimaryAction, Media, MediaContent, Actions, ActionButtons, ActionIcons} from '@smui/card';
  import Textfield from "@smui/textfield";

  let header = "";
  let description = "";
  let createTemplate = false;
  let error = false;
  const postsData = firestore.collection("articles");

  const posts = collectionData(
    postsData.orderBy("created", "desc"),
    "id"
  ).pipe(startWith([]));
   const addPost = () => {
     if(header && description) {
      firestore
        .collection("articles")
        .add({ header, description, created: Date.now(), checked: false });
        header = "";
        description = "";
        createTemplate = false;
        error = false;
     } else {
       error = true;
     }
    
  }
  const addToFavourite = (event) => {
    const { id, newStatus } = event.detail;
    firestore
      .collection("articles")
      .doc(id)
      .update({ checked: newStatus });
  }
</script>

<style>
  .posts {
    list-style-type: none;
    padding: 0;
  }
  .blog-wrap {
    max-width: 360px;
    text-align: center;
    background-color: #fff;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin: 0 auto;
  }
  .blog-header {
    font-size: 24px;
    color: #fff;
    background-color: #ff3e00;
    text-align: center;
    margin: 0;
    padding: 10px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .create-post-wrap{
    display: flex;
    flex-direction: column;
  }
  .error-message{
    color: red;
  }
</style>

<div class="blog-wrap">
  <h1 class="blog-header">Blog</h1>
  <ul class="posts">
    {#each $posts as post}
      <Post {...post} on:toggle={addToFavourite} />
    {/each}
  </ul>
  {#if createTemplate}
<Card style="width: 360px; padding: 20px;">

    <div class="create-post-wrap">
      <Textfield bind:value={header}  input$required  label="Title" />
      <Textfield  textarea bind:value={description} label="Description" />
      {#if error}
        <div class="error-message">
          please fill fields
        </div>
       {/if}
      <Button on:click={addPost}>
        <Label>add post</Label>
      </Button>
    </div>
    </Card>

  {/if}
<Button style="margin-top: 20px;" on:click={() => (createTemplate = !createTemplate)}>
  <Label>create new post</Label>
</Button>
</div>

