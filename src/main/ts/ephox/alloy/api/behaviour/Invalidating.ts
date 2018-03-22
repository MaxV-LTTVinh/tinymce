import * as Behaviour from './Behaviour';
import { Representing } from './Representing';
import * as ActiveInvalidate from '../../behaviour/invalidating/ActiveInvalidate';
import * as InvalidateApis from '../../behaviour/invalidating/InvalidateApis';
import InvalidateSchema from '../../behaviour/invalidating/InvalidateSchema';
import { Future, Result, Option } from '@ephox/katamari';
import { AlloyComponent } from '../../api/component/ComponentApi';
import { Component } from '../../api/Main';
import { SugarElement } from '../../alien/TypeDefinitions';

export interface InvalidatingBehaviour extends Behaviour.AlloyBehaviour {
  config: <T>(config: InvalidatingConfig<T>) => { [key: string]: (any) => any };
  markValid: (Component: AlloyComponent) => void;
  markInvalid: (Component: AlloyComponent) => void;
  query: <T>(Component: AlloyComponent) => Future<T>;
  run: <T>(Component: AlloyComponent) => Future<T>;
  validation: (validate: (v: string) => Result<any, string>) => (component: AlloyComponent) => any;
}

export interface InvalidatingConfig<T> {
  invalidClass: string;
  notify?: {
    getContainer: (input: AlloyComponent) => Option<SugarElement>;
  };
  onEvent?: string;
  getRoot?: () => any;
  validator: {
    validate: (input: AlloyComponent) => Future<Result<any, string> | Result<string, any>>
    onEvent: string;
  };
}

const Invalidating = Behaviour.create({
  fields: InvalidateSchema,
  name: 'invalidating',
  active: ActiveInvalidate,
  apis: InvalidateApis,

  extra: {
    // Note, this requires representing to be on the validatee
    validation (validator) {
      return function (component) {
        const v = Representing.getValue(component);
        return Future.pure(validator(v));
      };
    }
  }
}) as InvalidatingBehaviour;

export {
  Invalidating
};