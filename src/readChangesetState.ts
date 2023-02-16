import { PreState, NewChangeset } from "@cosm-changesets/types";
import { readPreState } from "@cosm-changesets/pre";
import readChangesets from "@cosm-changesets/read";

export type ChangesetState = {
  preState: PreState | undefined;
  changesets: NewChangeset[];
};

export default async function readChangesetState(
  cwd: string = process.cwd()
): Promise<ChangesetState> {
  let preState = await readPreState(cwd);
  let isInPreMode = preState !== undefined && preState.mode === "pre";

  let changesets = await readChangesets(cwd);

  if (isInPreMode) {
    let changesetsToFilter = new Set(preState.changesets);
    changesets = changesets.filter((x) => !changesetsToFilter.has(x.id));
  }

  return {
    preState: isInPreMode ? preState : undefined,
    changesets,
  };
}
