<script>
  import { startWith } from 'rxjs/operators'
  import './Post.svelte'
  import './Captcha.svelte'
  import { collectionData, firestore } from './../firebase'
  import firebase, { app } from '../firebase'
  import { put, getDownloadURL } from 'rxfire/storage'
  import { storage } from '../firebase'
  import { onMount, onDestroy } from 'svelte'
  import '@material/mwc-button'
  export let width = '350px'
  export let right = '50%'
  export let top = '10%'
  let container
  let count = 0
  let header = ''
  let description = ''
  let createTemplate = false
  let error = false
  let url = ''
  let file = ''
  let allPosts = false
  let posts = []
  const myUrl = new URL(window.location.href)
  const urlOrigin = myUrl.origin

  const postsData = firestore
    .collection('articles')
    .where('url', '==', urlOrigin)
  collectionData(postsData, 'id').subscribe((data) => {
    posts = data
  })

  const addPost = async (event) => {
    const { valid } = event.detail
    if (
      (header && description && url && count < 2) ||
      (header && description && url && valid && count > 2)
    ) {
      var storageRef = storage.ref('images/' + file.name)
      var task = storageRef.put(file)
      task.on('state_changed', function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      })
      await firestore
        .collection('articles')
        .add({
          header,
          description,
          created: Date.now(),
          checked: false,
          image: firestore.doc('/images/' + file.name),
          likes: 0,
          url: urlOrigin,
        })
        .then((ref) => {
          header = ''
          description = ''
          createTemplate = false
          error = false
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      count += 1
      error = true
    }
  }
  const removePost = (event) => {
    const { id } = event.detail
    firestore.collection('articles').doc(id).delete()
  }
  const countLikes = (event) => {
    const { id, newStatus, likes } = event.detail

    const num = newStatus ? likes + 1 : likes - 1
    firestore
      .collection('articles')
      .doc(id)
      .update({ likes: num, checked: newStatus })
  }
  const addComment = (event) => {
    const { id, commentName, comment, commentsBlock } = event.detail

    const generateNumber =
      commentsBlock.length === 0 ? 1 : commentsBlock.length + 1
    const newComments = {
      ...commentsBlock,
      [generateNumber]: {
        date: Date.now(),
        comment,
        name: commentName,
      },
    }
    firestore.collection('articles').doc(id).update({ comments: newComments })
  }
  const onFileChange = (event) => {
    var fileData = event.target.files[0]
    file = fileData
  }
</script>

<style>
  h1,
  div {
    font-family: 'Helvetica Neue', sans-serif;
  }
  .posts {
    list-style-type: none;
    padding: 0;
  }

  .blog-wrap {
    text-align: center;
    background-color: #fff;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 4px;
    bottom: 0;
    position: fixed;
    overflow-y: scroll;
    overflow-x: hidden;
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
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    padding: 10px;
    border-radius: 5px;
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
  input,
  textarea {
    margin-bottom: 20px;
    display: flex;
    border-radius: 5px;
    padding: 12px 16px 14px;
    border: 1px rgba(0, 0, 0, 0.2) solid;

    z-index: 1;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  }
  input[type='file'] {
    box-shadow: none;
    border: none;
  }
  mwc-button {
    --mdc-theme-primary: #ff3e00;
    --mdc-theme-on-primary: white;
    margin-top: 12px;
  }
  .close-form {
    text-align: right;
    margin-bottom: 10px;
    font-size: 21px;
    cursor: pointer;
  }
</style>

<svelte:options tag={'blog-window'} />

<div
  class="blog-wrap"
  style="width: {width}; max-width: {width}; right: {right}; top: {top}">
  <h1 class="blog-header">Blog</h1>
  <ul class="posts">
    {#each allPosts ? posts : posts.slice(0, 3) as post}
      <my-thing
        {...post}
        on:toggle={countLikes}
        on:addComment={addComment}
        on:removePost={removePost} />
    {/each}
  </ul>
  {#if createTemplate}
    <div>
      <div class="create-post-wrap">
        <div
          class="close-form"
          on:click={() => (createTemplate = !createTemplate)}>
          &times;
        </div>
        <input bind:value={header} required placeholder="Title" />
        <textarea bind:value={description} placeholder="Description" />
        <input type="file" on:change={onFileChange} bind:value={url} />
        {#if error}
          <div class="error-message">please fill fields</div>
        {/if}
        {#if count > 2}
          <captcha-custom on:checkCaptcha={addPost} />
        {/if}
        <mwc-button on:click={addPost} label="add post" raised />
      </div>
    </div>
  {/if}
  <div class="show-all-btn">
    {#if posts.length > 3}
      {#if !allPosts}
        <mwc-button
          on:click={() => (allPosts = !allPosts)}
          label="show all posts"
          raised />
      {:else}
        <mwc-button
          on:click={() => (allPosts = !allPosts)}
          label="show less posts"
          raised />
      {/if}
    {/if}
  </div>
  <mwc-button
    on:click={() => (createTemplate = !createTemplate)}
    label="create new post"
    raised />
</div>
