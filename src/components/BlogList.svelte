
<script>
  import Post from "./Post.svelte";
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
  let allPosts = false;
  const postsData = firestore.collection("articles").orderBy("created");
  let posts = [];
  let urlImage;
  let commentsBlock = [];
  let fullText = false;
  let showComments = false;
  let createComment = false;

  let commentName = "";
  let comment = "";
  collectionData(postsData, "id").subscribe(users => {
    posts = users;
  });

  const addPost = () => {
    if (header && description) {
      firestore.collection("articles").add({
        header,
        description,
        created: Date.now(),
        checked: false,
        image: firestore.doc("/images/" + file.name),
        likes: 0
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
  const countLikes = event => {
    const { id, newStatus, likes } = event.detail;
    const num = newStatus ? likes + 1 : likes - 1;
    firestore
      .collection("articles")
      .doc(id)
      .update({ likes: num, checked: newStatus });
  };
  const addComment = event => {
    const { id, commentName, comment, commentsBlock } = event.detail;

    const generateNumber =
      commentsBlock.length === 0 ? 1 : commentsBlock.length + 1;
    const newComments = {
      ...commentsBlock,
      [generateNumber]: {
        name: commentName,
        comment,
        date: Date.now()
      }
    };
    firestore
      .collection("articles")
      .doc(id)
      .update({
        comments: newComments
      });
  };
  const onFileChange = event => {
    var fileData = event.target.files[0];
    file = fileData;
  };
  const createComments = () => {
    createComment = !createComment
  }
  const showCommentsBlock = () => {
    showComments = !showComments
  }
    const fullTextShow = () => {
      fullText = !fullText
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
    /* position: absolute;
    top: 50%;
    right: 10%; */
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
  .show-all-btn {
    text-align: left;
  }
</style>
<svelte:options tag={"blog-window"} immutable={true} />

<div class="blog-wrap">
  <h1 class="blog-header">Blog</h1>
  <ul class="posts">
    {#each allPosts ? posts : posts.slice(0, 3) as post}
      <li>
  <div class="card" style="width: 360px; padding: 20px;">
    <span class="post-date">{new Date(post.created).toLocaleString()}</span>
    <h2>{header}</h2>
    {#if urlImage}
    <div class="post-image">
      <img src={post.urlImage} alt="" />
    </div>
    {/if}
    <div class={fullText ? 'active' : ''}>{description}</div>
    <div>
      {#if description.length > 70}
          <div>
            {#if !fullText}
              <span>show more</span>
            {:else}
              <span>show less</span>
            {/if}
          </div>
        {/if}
      <div>
        <div
          class="action-button"
          on:click={toggleStatus}
          on:click={checked}
          toggle
          aria-label="Add to favorites"
          title="Add to favorites">
          <div class="material-icons" on>favorite</div>
          <div class="material-icons">favorite_border</div>
          <span class="comment-number"> {post.likes}</span>
        </div>
        <div
          class="action-button"
          on:click={showCommentsBlock}
          toggle
          aria-label="Add to favorites"
          title="Add to favorites">
          <div class="material-icons" on>comment</div>
          <div class="material-icons">comment_border</div>
          <span class="comment-number">{commentsBlock.length}</span>
        </div>
      </div>
    {#if showComments}
      <ul class="comments-wrap">
        {#if commentsBlock.length > 0}
          <h3>Comments</h3>
        {:else}
        <h3>No Comments. Write One.</h3>
        {/if}
        {#each commentsBlock as comment}
          <li>
            <div class="comment-name">
            <div class="material-icons">face</div>
              {comment.name}
              <p>{new Date(comment.date).toLocaleString()}</p>
            </div>
            <div>{comment.comment}</div>
          </li>
        {/each}
      </ul>
      {#if createComment}
        <div class="create-comment-wrap">
        <input type="text" value={commentName} required placeholder="Name">
        <textarea > </textarea>
          {#if error}
            <div class="error-message">please fill fields</div>
          {/if}
          <div on:click={addComment}>
            <span>add comment</span>
          </div>
        </div>
      {/if}
      
      <div
        style="margin-top: 20px;"
        on:click={createComments}>
        <span>write a comment</span>
      </div>
    {/if}

  </div>
</li>
    {/each}
  </ul>
  {#if createTemplate}
    <div style="width: 360px; padding: 20px;">
      <div class="create-post-wrap">
        <!-- <Textfield bind:value={header} input$required label="Title" />
        <Textfield textarea bind:value={description} label="Description" />
        <Textfield type="file" on:change={onFileChange} bind:value={url} /> -->
        {#if error}
          <div class="error-message">please fill fields</div>
        {/if}
        <!-- <Button on:click={addPost}>
          <Label>add post</Label>
        </Button> -->
      </div>
    </div>
  {/if}
  <div class="show-all-btn">
    <!-- <Button style="margin-top: 20px;" on:click={() => (allPosts = !allPosts)}>
      {#if posts.length > 3}
        {#if !allPosts}
          <Label>show all posts</Label>
        {:else}
          <Label>show less posts</Label>
        {/if}
      {/if}

    </Button> -->
  </div>
  <!-- <Button
    style="margin-top: 20px;"
    on:click={() => (createTemplate = !createTemplate)}>
    <Label>create new post</Label>
  </Button> -->

</div>
