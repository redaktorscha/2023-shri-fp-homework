/* eslint-disable react-hooks/rules-of-hooks */
/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
  allPass,
  lt,
  gt,
  prop,
  length,
  compose,
  __,
  pipe,
  test,
  mathMod,
  otherwise,
  andThen,
  flip,
  tap,
  ifElse,
  partial,
  converge,
} from 'ramda';

//constants
const BASE_TEN = 10;
const BASE_TWO = 2;
const API_NUMBERS = 'https://api.tech/numbers/base';
const API_ANIMALS = 'https://animals.tech';


//helpers
const routes = {
  numbers: () => API_NUMBERS,
  animals: (id) => [API_ANIMALS, id].join('/'),
};

const configs = {
  numbers: (val) => ({
    from: BASE_TEN,
    to: BASE_TWO,
    number: val,
  }),
  animals: () => ({}),
}

const regex = /([0-9]*[.])?[0-9]+/;

const charCountLessThenTen = compose(lt(__, 10), length);
const charCountMoreThenTwo = compose(gt(__, 2), length);
const isPositive = compose(gt(__, 0), Number);
const isNumber = test(regex);
const toStringifiedRoundedNumber = compose(String, Math.round, Number);
const getLength = length;
const getPowTwo = compose(flip(Math.pow)(2), Number);
const getRemainderDividedByThree = mathMod(__, 3);

const getResult = prop('result');

const validateInput = allPass([
  charCountLessThenTen,
  charCountMoreThenTwo,
  isPositive,
  isNumber,
]);

const api = new Api();

const getConvertedToBaseTwo = converge(api.get, [routes.numbers, configs.numbers]);

const getAnimalType = converge(api.get, [routes.animals, configs.animals]);


const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const log = tap(writeLog);
  const onError = partial(handleError, ['ValidationError']);

  const handleInput = pipe(
    toStringifiedRoundedNumber,
    log,
    getConvertedToBaseTwo,
    andThen(getResult),
    andThen(log),
    andThen(getLength),
    andThen(log),
    andThen(getPowTwo),
    andThen(log),
    andThen(getRemainderDividedByThree),
    andThen(log),
    andThen(getAnimalType),
    andThen(getResult),
    andThen(handleSuccess),
    otherwise(handleError),
  );

  const handleValidation = ifElse(validateInput, handleInput, onError);

  const initSequence = pipe(
    log,
    handleValidation,
  );

  initSequence(value);
};

export default processSequence;
