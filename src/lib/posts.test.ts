import { test } from "node:test";
import assert from "node:assert/strict";
import { postNeighbours } from "./posts.ts";
import type { PostRow } from "./db.ts";

const p = (id: number, project_id: number | null) => ({ id, project_id }) as PostRow;
const all = [p(5, null), p(4, 1), p(3, null), p(2, 1), p(1, 1)];

test("newer and older follow the list order", () => {
  const n = postNeighbours(all, p(3, null));
  assert.equal(n.newer?.id, 4);
  assert.equal(n.older?.id, 2);
});

test("the ends of the list have one neighbour", () => {
  assert.equal(postNeighbours(all, p(5, null)).newer, null);
  assert.equal(postNeighbours(all, p(1, 1)).older, null);
});

test("related posts share the project and exclude the post itself", () => {
  assert.deepEqual(postNeighbours(all, p(2, 1)).related.map((x) => x.id), [4, 1]);
  assert.deepEqual(postNeighbours(all, p(3, null)).related, []);
});

test("a post missing from the list (a draft) has no trail", () => {
  const n = postNeighbours(all, p(99, 1));
  assert.equal(n.newer, null);
  assert.equal(n.older, null);
});
