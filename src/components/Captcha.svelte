<script>
  import { onMount } from 'svelte'
  import '@material/mwc-button'
  import { createEventDispatcher } from 'svelte/internal'
  import { get_current_component } from 'svelte/internal'
  let code
  let captchaText
  let container
  let error
  const svelteDispatch = createEventDispatcher()
  const component = get_current_component()
  const createCaptcha = () => {
    container.innerHTML = ''
    let charsArray =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*'
    const lengthOtp = 6
    let captcha = []
    for (let i = 0; i < lengthOtp; i++) {
      var index = Math.floor(Math.random() * charsArray.length + 1)
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index])
      else i--
    }
    let canv = document.createElement('canvas')
    canv.id = 'captcha'
    canv.width = 100
    canv.height = 50
    let ctx = canv.getContext('2d')
    ctx.font = '25px Georgia'
    ctx.strokeText(captcha.join(''), 0, 30)
    code = captcha.join('')
    container.appendChild(canv)
  }
  const validateCaptcha = () => {
    if (captchaText == code) {
      component.dispatchEvent &&
        component.dispatchEvent(
          new CustomEvent('checkCaptcha', {
            detail: { valid: true },
          }),
        )
      error = false
      captchaText = ''
    } else {
      component.dispatchEvent &&
        component.dispatchEvent(
          new CustomEvent('checkCaptcha', {
            detail: { valid: false },
          }),
        )
      error = true
      captchaText = ''
      createCaptcha()
    }
  }
  onMount(async () => {
    await createCaptcha()
  })
</script>

<style>
  input[type='text'] {
    padding: 12px 20px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  mwc-button {
    --mdc-theme-primary: #ff3e00;
    --mdc-theme-on-primary: white;
  }
  .error-message {
    color: red;
    margin: 20px 0;
    text-align: left;
    text-transform: capitalize;
  }
</style>

<svelte:options tag="captcha-custom" />

<div id="captcha" bind:this={container} />
<input
  type="text"
  bind:value={captchaText}
  placeholder="Captcha"
  id="cpatchaTextBox" />
<mwc-button on:click={validateCaptcha} label="Submit" raised />
{#if error}
  <div class="error-message">Wrong! Try again</div>
{/if}
