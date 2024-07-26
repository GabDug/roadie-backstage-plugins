/*
 * Copyright 2021 Larder Software Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { PrometheusGraph } from './PrometheusGraph';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  PROMETHEUS_RULE_ANNOTATION,
  PROMETHEUS_PLUGIN_DOCUMENTATION,
} from '../util';
import { renderString } from 'nunjucks';
import { stringifyEntityRef } from '@backstage/catalog-model';

export const PrometheusGraphEntityWrapper = ({
  step = 14,
  range = { hours: 1 },
  graphType,
  enableQueryTemplating,
  query,
}: {
  step?: number;
  range?: { hours?: number; minutes?: number };
  graphType?: 'line' | 'area';
  query?: string;
  enableQueryTemplating?: boolean;
}) => {
  const { entity } = useEntity();

  let fullQuery =
    entity.metadata.annotations?.[PROMETHEUS_RULE_ANNOTATION] || query;

  if (!fullQuery) {
    return (
      <MissingAnnotationEmptyState
        annotation={PROMETHEUS_RULE_ANNOTATION}
        readMoreUrl={PROMETHEUS_PLUGIN_DOCUMENTATION}
      />
    );
  }

  if (enableQueryTemplating) {
    fullQuery = renderString(fullQuery, {
      ...entity,
      entityRef: stringifyEntityRef(entity),
    });
  }

  const ruleTuples = fullQuery
    ? fullQuery.split(',').map(it => it.split('|'))
    : [];

  if (ruleTuples.length > 0) {
    const [ultimateQuery, dimension] = ruleTuples[0];
    return (
      <PrometheusGraph
        dimension={dimension}
        query={ultimateQuery}
        range={range}
        step={step}
        graphType={graphType}
      />
    );
  }
  return <></>;
};
