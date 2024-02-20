<script lang="ts">
  let response: String;

  let a: number = 0;
  let b: number = 0;
  
  async function sendRequest() {
    const res = await fetch("/api", {
      method: "GET",
    });

    return res.text();
  }

  async function addNumbers(a: number, b: number) {

    const res = await fetch(`/api/add/${a}/${b}`, {
      method: "GET";
    })
    return res.text();
  }

  async function getHome() {
    response = await sendRequest();
  }
</script>

<main>
  {response}

  <button on:click={() => addNumbers(2,4)}>Send request</button>
  {response}

  A = <input type="number" bind:value={a} />
  B = <input type="number" bind:value={b} />
  <button on:click={async () => {
    response = await addNumbers(a,b);
  }} >Send request</button>

  A + B = {respose}
</main>

