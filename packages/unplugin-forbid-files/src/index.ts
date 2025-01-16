import { createUnplugin } from "unplugin";
import { resolve } from "import-meta-resolve";

export default createUnplugin((predicate: (id: string) => boolean) => ({
  name: "@jahia/unplugin-forbid-files",
  resolveId(id, importer) {
    if (!importer) {
      return null;
    }
    console.log(id, importer);
    const resolved = resolve(id, importer);
    if (predicate(resolved)) {
      this.error(`Forbidden import "${id}" from "${importer}"`);
    }
    return null;
  },
}));
