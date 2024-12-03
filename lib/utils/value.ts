/**
 * Import required dependencies
 */
import { Values } from "../types";
import { remapValue } from "./math";

export const getMinMaxValues = (values: Values) => {
  let index = 0;
  let maxIndex = 0;
  let minIndex = 0;
  let maxValue = -Infinity;
  let minValue = Infinity;

  for (const value of values) {
    if (value < minValue) {
      minValue = value;
      minIndex = index;
    }
    if (value > maxValue) {
      maxValue = value;
      maxIndex = index;
    }

    index++;
  }

  return {
    maxValue,
    maxIndex,
    minValue,
    minIndex,
  };
};

/**
 * Normalizes an array of values to a range of [0, 1]
 * @param {Values} values - Array of numerical values to normalize
 * @returns {Values} Array of normalized values, where the largest value becomes 1
 * and all other values are scaled proportionally
 * @description
 * Finds the maximum value in the array and divides all values by it, resulting in:
 * - All values will be in the range [0, 1]
 * - The largest value will become exactly 1
 * - The relative proportions between values are preserved
 * @example
 * normalizeValues([10, 20, 30]) // returns [0.333..., 0.666..., 1]
 */
export const normalizeValues = (values: Values) => {
  let maxValue = -Infinity;
  let minValue = Infinity;
  for (const value of values) {
    if (value < minValue) {
      minValue = value;
    }
    if (value > maxValue) {
      maxValue = value;
    }
  }
  return values.map((it) => remapValue(it, minValue, maxValue, 0, 1));
};

/**
 * Remaps an array of values from their current range to a new target range
 * @param {Values} values - Array of numerical values to remap
 * @param {number} low - Lower bound of the target range
 * @param {number} hight - Upper bound of the target range
 * @returns {Values} Array of remapped values scaled to the new range
 * @description
 * Process:
 * 1. First normalizes the values to [0, 1] range
 * 2. Then remaps each normalized value to the target range [low, hight]
 * The relative proportions between values are preserved in the new range
 * @example
 * remapValues([10, 20, 30], 0, 100) // remaps to [33.33..., 66.66..., 100]
 */
export const remapValues = (values: Values, low: number, hight: number) => {
  const normalized = normalizeValues(values);
  return normalized.map((it) => remapValue(it, 0, 1, low, hight));
};

export const getDay = (dayIndex: number, values: Values) =>
  values.slice(dayIndex * 24, dayIndex * 24 + 24);

export const getWeek = (weekIndex: number, values: Values) =>
  values.slice(weekIndex * 24 * 7, weekIndex * 24 * 7 + 24 * 7);

export const getMonth = (monthIndex: number, values: Values) =>
  values.slice(monthIndex * 24 * 7, monthIndex * 24 * 7 + 24 * 7);

export type AggregationPeriod = "day" | "week" | "month" | "year";

export interface AggregationConfig {
  period: AggregationPeriod;
  aggregationType: "sum" | "average" | "max" | "min";
  startDate: Date;
}

export interface AggregatedResult {
  startTime: Date;
  endTime: Date;
  value: number;
}

/**
 * Aggregates hourly time series data based on specified configuration
 * @param hourlyValues Array of numeric values, each representing one hour
 * @param config Configuration for aggregation period and type
 * @returns Array of aggregated results with time bounds and values
 */
export const aggregateTimeSeries = (
  hourlyValues: number[],
  config: AggregationConfig
): AggregatedResult[] => {
  const results: AggregatedResult[] = [];
  let currentDate = new Date(config.startDate);
  let currentValues: number[] = [];

  // Helper to get period end date
  const getPeriodEndDate = (date: Date, period: AggregationPeriod): Date => {
    const endDate = new Date(date);
    switch (period) {
      case "day":
        endDate.setDate(date.getDate() + 1);
        break;
      case "week":
        endDate.setDate(date.getDate() + 7);
        break;
      case "month":
        endDate.setMonth(date.getMonth() + 1);
        break;
      case "year":
        endDate.setFullYear(date.getFullYear() + 1);
        break;
    }
    return endDate;
  };

  // Helper to calculate aggregated value
  const calculateAggregatedValue = (values: number[], type: string): number => {
    if (values.length === 0) return 0;

    switch (type) {
      case "sum":
        return values.reduce((sum, val) => sum + val, 0);
      case "average":
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case "max":
        return Math.max(...values);
      case "min":
        return Math.min(...values);
      default:
        return 0;
    }
  };

  let periodEndDate = getPeriodEndDate(currentDate, config.period);
  let hourIndex = 0;

  while (hourIndex < hourlyValues.length) {
    const hourDate = new Date(config.startDate);
    hourDate.setHours(hourDate.getHours() + hourIndex);

    if (hourDate < periodEndDate) {
      currentValues.push(hourlyValues[hourIndex]);
      hourIndex++;
    } else {
      // Aggregate current period
      if (currentValues.length > 0) {
        results.push({
          startTime: new Date(currentDate),
          endTime: new Date(periodEndDate),
          value: calculateAggregatedValue(
            currentValues,
            config.aggregationType
          ),
        });
      }

      // Move to next period
      currentDate = new Date(periodEndDate);
      periodEndDate = getPeriodEndDate(currentDate, config.period);
      currentValues = [];
    }
  }

  // Handle remaining values
  if (currentValues.length > 0) {
    results.push({
      startTime: new Date(currentDate),
      endTime: new Date(periodEndDate),
      value: calculateAggregatedValue(currentValues, config.aggregationType),
    });
  }

  return results;
};
