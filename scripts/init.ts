
import { $ } from 'bun'

await $`cd ./src/MusicalChairs.Web/ && bun i`
await $`bun run devDb && bun run dev`