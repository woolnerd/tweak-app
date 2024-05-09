import { useEffect } from "react";

import UniverseDataBuilder from "../../lib/universe-data-builder.ts";
import ValueUniverse, { DmxTuple } from "../../util/value-universe.ts";
import { useCompositeFixtureStore } from "../store/useCompositeFixtureStore.ts";
import { useManualFixtureStore } from "../store/useManualFixtureStore.ts";
import { useOutputValuesStore } from "../store/useOutputValuesStore.ts";

export default function useUniverseOutput() {
  const { updateOutputValuesStore } = useOutputValuesStore((state) => state);
  const { manualFixturesStore } = useManualFixtureStore((state) => state);
  const { compositeFixturesStore } = useCompositeFixtureStore((state) => state);

  useEffect(() => {
    if (compositeFixturesStore.length > 0) {
      const universeObjs = compositeFixturesStore.map((compFixture) => {
        if (compFixture.channel in manualFixturesStore) {
          compFixture.values = manualFixturesStore[compFixture.channel].values;
        }
        return new UniverseDataBuilder(compFixture).buildUniverses();
      });

      const outputUniverses =
        UniverseDataBuilder.mergeUniverseData(universeObjs);

      updateOutputValuesStore(outputUniverses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compositeFixturesStore, manualFixturesStore]);
}
