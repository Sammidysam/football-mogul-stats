// Accepts link objects from `divisionsconferences.js`
// indexObject adds support for mapping teams to divisons then grouping them.
const linksToGroups = (links, indexObject) => (
  links.reduce((total, currentValue) => {
    // All links should be 'same' unless something weird is going on
    // (like the Jets/Giants bug).
    // If so, we skip it.
    if (currentValue.type === 'different')
      return total;

    const teamIds = currentValue.teamIds;
    const warpedIndexes = indexObject ? teamIds.map(tid => indexObject.findIndex(d => d.has(tid))) : teamIds;
    const indexes = warpedIndexes.map(tid => total.findIndex(d => d.has(tid)));
    const greatestIndex = Math.max(...indexes);

    if (greatestIndex === -1) {
      total.push(new Set(warpedIndexes));
    } else if (indexes.every(i => i > -1) && (new Set(indexes)).size > 1) {
      // Merge the two groups.
      const removed = total[indexes[0]];

      removed.forEach(tid => total[indexes[1]].add(tid));
      warpedIndexes.forEach(tid => total[indexes[1]].add(tid));
      total.splice(indexes[0], 1);
    } else {
      warpedIndexes.forEach(tid => total[greatestIndex].add(tid));
    }

    return total;
  }, [])
);

module.exports = {
  linksToGroups
};
