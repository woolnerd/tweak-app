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
        return new UniverseDataBuilder(compFixture).toUniverseTuples();
      });

      //
      // pass universeObjs to a method that instantiates an object
      const universe = new ValueUniverse(1);
      universeObjs.flat().forEach((uni: DmxTuple) => {
        universe.addDmxValues(uni);
      });

      console.log({ universe });
      console.log({ universeObjs });

      updateOutputValuesStore(universe.getDmxValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compositeFixturesStore, manualFixturesStore]);
}
