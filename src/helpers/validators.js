/* eslint-disable react-hooks/rules-of-hooks */
import {
  allPass,
  equals,
  gte,
  prop,
  filter,
  length,
  compose,
  pick,
  __,
  pipe,
  keys,
  curry,
  all,
  values,
  complement,
  and,
  not,
  anyPass,
  apply,
  map,
  reduce,
  props,
} from 'ramda';

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
const reduceToColorCount = (acc, cur) => ({...acc, [cur]: (acc[cur] || 0) + 1});

//helpers
const getStar = prop('star');
const getTriangle = prop('triangle');
const getSquare = prop('square');
const getCircle = prop('circle');

const isColorRed = equals(__, 'red');
const isColorGreen = equals(__, 'green');
const isColorWhite = equals(__, 'white');
const isColorBlue = equals(__, 'blue');
const isColorOrange = equals(__, 'orange');

const isRedStar = pipe(getStar, isColorRed);
const isWhiteStar = pipe(getStar, isColorWhite);
const isGreenSquare = pipe(getSquare, isColorGreen);
const isGreenTriangle = pipe(getTriangle, isColorGreen);
const isBlueCircle = pipe(getCircle, isColorBlue);
const isOrangeSquare = pipe(getSquare, isColorOrange);
const isWhiteTriangle = pipe(getTriangle, isColorWhite);
const isWhiteCircle = pipe(getCircle, isColorWhite);
const isWhiteSquare = pipe(getSquare, isColorWhite);

const getAllGreenFigures = filter(isColorGreen);
const getAllRedFigures = filter(isColorRed);
const getAllBlueFigures = filter(isColorBlue);

const getObjectKeysLength = pipe(keys, length);
const getGreenQuantity = compose(getObjectKeysLength, getAllGreenFigures);
const getRedQuantity = compose(getObjectKeysLength, getAllRedFigures);
const getBlueQuantity = compose(getObjectKeysLength, getAllBlueFigures);
const getOrangeQuantity = compose(getObjectKeysLength, getAllBlueFigures);

const minTwoGreenFigures = compose(gte(__, 2), getGreenQuantity);

const areAllGreen = all(isColorGreen);
const areAllOrange = all(isColorOrange);

const minThreeGreenFigures = compose(gte(__, 3), getGreenQuantity);
const minThreeRedFigures = compose(gte(__, 3), getRedQuantity);
const minThreeOrangeFigures = compose(gte(__, 3), getOrangeQuantity);
const minThreeBlueFigures = compose(gte(__, 3), getBlueQuantity);

const twoGreenFigures = compose(equals(__, 2), getGreenQuantity);
const oneRedFigure = compose(equals(__, 1), getRedQuantity);

const isNotWhiteTriangle = complement(isWhiteTriangle);
const isNotWhiteSquare = complement(isWhiteSquare);
const isNotRedStar = complement(isRedStar);
const isNotWhiteStar = complement(isWhiteStar);


const checkArrElemsEquality = apply(equals);
const triangleColorEqualsSquareColor = compose(checkArrElemsEquality, values, pick(['triangle', 'square']));


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isRedStar, isGreenSquare, isWhiteTriangle, isWhiteCircle]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = minTwoGreenFigures;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = pipe(values, reduce(reduceToColorCount, {}), props(['red', 'blue']), checkArrElemsEquality);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isBlueCircle, isRedStar, isOrangeSquare]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([minThreeGreenFigures, minThreeRedFigures, minThreeOrangeFigures, minThreeBlueFigures]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([twoGreenFigures, isGreenTriangle, oneRedFigure]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(values, areAllOrange);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(values, areAllGreen);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 =  allPass([isNotWhiteTriangle, isNotWhiteSquare, triangleColorEqualsSquareColor]);