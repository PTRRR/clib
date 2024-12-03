/**
 * Creates a deep copy of an object excluding specified properties
 *
 * @param obj The source object to copy
 * @param propsToOmit Array of property paths to exclude (supports dot notation)
 * @returns A new object without the specified properties
 */
export function omitProperties<T extends Record<string, any>>(
  obj: T,
  propsToOmit: string[]
): Partial<T> {
  // Helper function to check if a path should be omitted
  const shouldOmitPath = (path: string): boolean => {
    return propsToOmit.some((prop) => {
      // Check exact match
      if (prop === path) return true;
      // Check if current path is a parent of omitted path
      if (prop.startsWith(path + ".")) return true;
      // Check if current path is a child of omitted path
      if (path.startsWith(prop + ".")) return true;
      return false;
    });
  };

  // Helper function for deep cloning while omitting properties
  const deepCloneWithoutProps = (value: any, currentPath: string = ""): any => {
    // Handle null or undefined
    if (value == null) return value;

    // Handle Date objects
    if (value instanceof Date) return new Date(value);

    // Handle Arrays
    if (Array.isArray(value)) {
      return value.map((item, index) =>
        deepCloneWithoutProps(item, `${currentPath}[${index}]`)
      );
    }

    // Handle Objects
    if (typeof value === "object") {
      const result: Record<string, any> = {};

      for (const key of Object.keys(value)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        if (!shouldOmitPath(newPath)) {
          result[key] = deepCloneWithoutProps(value[key], newPath);
        }
      }

      return result;
    }

    // Handle primitive values
    return value;
  };

  return deepCloneWithoutProps(obj);
}

// Type helper for better TypeScript inference
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  return omitProperties(obj, keys as string[]) as Omit<T, K>;
}
