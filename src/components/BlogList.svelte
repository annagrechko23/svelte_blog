<script>
  import { startWith } from 'rxjs/operators'
  import { collectionData, firestore } from './../firebase'
  import firebase, { app } from '../firebase'
  import { put, getDownloadURL } from 'rxfire/storage'
  import { storage } from '../firebase'

  let header = ''
  let description = ''
  let createTemplate = false
  let error = false
  let url = ''
  let file = ''
  let allPosts = false
  const postsData = firestore.collection('articles').orderBy('created')
  let posts = []
  let urlImage
  let commentsBlock = []
  let fullText = false
  let showComments = false
  let createComment = false

  let commentName = ''
  let comment = ''
  collectionData(postsData, 'id').subscribe((users) => {
    posts = users
  })

  const addPost = () => {
    if (header && description) {
      firestore.collection('articles').add({
        header,
        description,
        created: Date.now(),
        checked: false,
        image: firestore.doc('/images/' + file.name),
        likes: 0,
      })
      var storageRef = storage.ref('images/' + file.name)
      var task = storageRef.put(file)
      task.on('state_changed', function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      })
      header = ''
      description = ''
      createTemplate = false
      error = false
    } else {
      error = true
    }
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
        name: commentName,
        comment,
        date: Date.now(),
      },
    }
    firestore.collection('articles').doc(id).update({
      comments: newComments,
    })
  }
  const showImage = (image) => {
    const ref = storage.ref(image.path)
    getDownloadURL(ref).subscribe((url) => (urlImage = url))
    console.log(urlImage)
  }

  // if (comments) {
  //   commentsBlock = Object.values(comments);
  // }

  const onFileChange = (event) => {
    var fileData = event.target.files[0]
    file = fileData
  }
</script>

<style>
  .posts {
    list-style-type: none;
    padding: 0;
  }
  .card {
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 20px;
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
  li {
    margin-bottom: 20px;
  }
  .post-date {
    font-weight: bold;
    font-size: 12px;
    text-align: left;
  }
  .post-image {
    width: auto;
    height: 150px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .post-image img {
    width: 100%;
    height: auto;
  }
  .comment-number {
    font-size: 12px;
  }
  .comments-wrap {
    list-style-type: none;
    padding: 0;
    text-align: left;
  }
  .comments-wrap li {
    border: 1px solid #eee;
    padding: 0 10px 10px;
    border-radius: 5px;
  }
  h3 {
    font-size: 18px;
  }
  .action-btn {
    color: #ff3e00;
    border: 1px solid #ff3e00;
    border-radius: 5px;
    padding: 10px;
    display: inline-block;
    margin: 20px 0;
    cursor: pointer;
    transition: all 0.5s ease;
  }
  .action-btn:hover {
    color: #fff;
    background-color: #ff3e00;
  }
  .comment-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .comment-name p {
    display: flex;
    align-items: center;
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
  .description {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    padding: 0 !important;
  }
  .description.active {
    display: initial;
    -webkit-box-orient: initial;
  }
  .create-comment-wrap {
    display: flex;
    flex-direction: column;
  }
  input,
  textarea {
    margin-bottom: 20px;
    display: flex;
    border-radius: 5px;
    padding: 12px 16px 14px;
    border: none;
    z-index: 1;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  }
</style>

<svelte:options tag={'blog-window'} immutable={true} />

<div class="blog-wrap">
  <h1 class="blog-header">Blog</h1>
  <ul class="posts">
    {#each allPosts ? posts : posts.slice(0, 3) as post}
      <li>
        <div class="card">
          <span class="post-date">
            {new Date(post.created).toLocaleString()}
          </span>
          <h2>{post.header}</h2>
          {#if post.image}
            <div class="post-image">
              <img :src={showImage(post.image)} alt="" />
            </div>
          {/if}
          <div class={fullText ? 'active description' : 'description'}>
            {post.description}
          </div>
          <div>
            {#if post.description.length > 70}
              <div on:click={() => (fullText = !fullText)} class="action-btn">
                {#if !fullText}
                  show more
                {:else}
                  show less
                {/if}
              </div>
            {/if}
            <div>
              <div class="action-button" on:click={countLikes}>
                <i class="material-icons">favorite</i>

                <span class="comment-number">{post.likes}</span>
              </div>
              <div
                class="action-button"
                on:click={() => (showComments = !showComments)}>
                <i class="material-icons">comment</i>
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
                      <i class="material-icons">face</i>
                      {comment.name}
                      <p>{new Date(comment.date).toLocaleString()}</p>
                    </div>
                    <div>{comment.comment}</div>
                  </li>
                {/each}
              </ul>
              {#if createComment}
                <div class="create-comment-wrap">
                  <input
                    type="text"
                    value={commentName}
                    required
                    placeholder="Name" />
                  <textarea />
                  {#if error}
                    <div class="error-message">please fill fields</div>
                  {/if}
                  <div on:click={addComment} class="action-btn">
                  add comment
                  </div>
                </div>
              {/if}

              <div
                class="action-btn"
                style="margin-top: 20px;"
                on:click={() => (createComment = !createComment)}>
                <span>write a comment</span>
              </div>
            {/if}

          </div>
        </div>
      </li>
    {/each}
  </ul>
  {#if createTemplate}
    <div style="width: 360px; padding: 20px;">
      <div class="create-post-wrap">
        <input bind:value={header} required label="Title" />
        <textarea bind:value={description} label="Description" />
        <input type="file" on:change={onFileChange} bind:value={url} />
        {#if error}
          <div class="error-message">please fill fields</div>
        {/if}
        <div on:click={addPost} class="action-btn">add post</div>
      </div>
    </div>
  {/if}
  <div class="show-all-btn">
    <div
      style="margin-top: 20px;"
      on:click={() => (allPosts = !allPosts)}
      class="action-btn">
      {#if posts.length > 3}
        {#if !allPosts}show all posts{:else}show less posts{/if}
      {/if}

    </div>
  </div>
  <div
    class="action-btn"
    style="margin-top: 20px;"
    on:click={() => (createTemplate = !createTemplate)}>
    create new post
  </div>

</div>
