# vue-fetch

## Requirements

- define reusable `fetch` endpoints
- each endpoint is configured with a custom set of base headers and options
- authentication is handled by each endpoint

## Example

```ts
import { ref } from 'vue'
import { defineFetch, bearerAuth } from '@modernice/vue-fetch'

const authToken = ref('')

const useFetch = defineFetch({
	baseUrl: 'http://api.example.test',
	headers: { 'Content-Type': 'application/json' },
	auth: bearerAuth(authToken),
})

const { fetch } = useFetch()
```
