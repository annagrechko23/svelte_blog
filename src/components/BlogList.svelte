<script>
  import Post from "./Post.svelte";
  import { afterUpdate } from "svelte";
  import { startWith } from "rxjs/operators";
  import { collectionData, firestore } from "./../firebase";
  import firebase, { app } from "../firebase";
  import Button, { Label } from "@smui/button";
  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
    Actions,
    ActionButtons,
    ActionIcons
  } from "@smui/card";
  import Textfield from "@smui/textfield";
  import { put, getDownloadURL } from "rxfire/storage";
  import { storage } from "../firebase";

  let header = "";
  let description = "";
  let createTemplate = false;
  let error = false;
  let url = "";
  let file = "";
  const postsData = firestore.collection("articles").orderBy("created");
  // const posts = [];
  const posts = collectionData(postsData, "id").pipe(startWith([]));
  console.log(posts);
  afterUpdate(() => {
    const postsData = firestore.collection("articles").orderBy("created");

    console.log(postsData);
    console.log("the component just updated");
  });
  const addPost = () => {
    if (header && description) {
      firestore.collection("articles").add({
        header,
        description,
        created: Date.now(),
        checked: false,
        image: firestore.doc("/images/" + file.name)
      });
      var storageRef = storage.ref("images/" + file.name);
      var task = storageRef.put(file);
      task.on("state_changed", function progress(snapshot) {
        var percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      });
      header = "";
      description = "";
      createTemplate = false;
      error = false;
    } else {
      error = true;
    }
  };
  const addToFavourite = event => {
    const { id, newStatus } = event.detail;
    firestore
      .collection("articles")
      .doc(id)
      .update({ checked: newStatus });
  };
  const addComment = event => {
    const { id, commentName, comment, commentsBlock } = event.detail;
    console.log(commentsBlock);
    const generateNumber = commentsBlock.lenght + 1;
    firestore
      .collection("articles")
      .doc(id)
      .update({
        comments: {
          ...commentsBlock,
          [generateNumber]: {
            name: commentName,
            comment,
            date: Date.now()
          }
        }
      });
  };
  const onFileChange = event => {
    var fileData = event.target.files[0];
    file = fileData;
  };
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
  .create-post-wrap {
    display: flex;
    flex-direction: column;
  }
  .error-message {
    color: red;
    margin: 20px 0;
    text-align: left;
    text-transform: capitalize;
  }
</style>

<div class="blog-wrap">
  <h1 class="blog-header">Blog</h1>
  <ul class="posts">
    {#each $posts as post}
      <Post {...post} on:toggle={addToFavourite} on:addComment={addComment} />
    {/each}
  </ul>
  {#if createTemplate}
    <Card style="width: 360px; padding: 20px;">
      <div class="create-post-wrap">
        <Textfield bind:value={header} input$required label="Title" />
        <Textfield textarea bind:value={description} label="Description" />
        <Textfield type="file" on:change={onFileChange} bind:value={url} />
        {#if error}
          <div class="error-message">please fill fields</div>
        {/if}
        <Button on:click={addPost}>
          <Label>add post</Label>
        </Button>
      </div>
    </Card>
  {/if}
  <Button
    style="margin-top: 20px;"
    on:click={() => (createTemplate = !createTemplate)}>
    <Label>create new post</Label>
  </Button>
</div>
