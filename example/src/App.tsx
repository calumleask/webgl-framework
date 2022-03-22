import React from 'react';
import { Link, HashRouter as Router, Route, Routes } from 'react-router-dom';

import * as examples from './examples';

import './index.css';

const snake = (str: string): string => {
  return str.replace(/\s+/g, '-').toLowerCase();
};

const capitalizeEveryWord = (str: string): string => {
  return str.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
};

type ExampleWrapperProps = {
  title: string;
  Component: React.ComponentType;
};

const ExampleWrapper: React.FC<ExampleWrapperProps> = ({
  title,
  Component,
}: ExampleWrapperProps) => {
  return (
    <>
      <h2 style={{ margin: '20px 0 0 0' }}>{title}</h2>
      <Link style={{ margin: '0 0 20px 0' }} to={'/'}>
        {'Back'}
      </Link>
      <Component />
    </>
  );
};

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ margin: 0 }}>
        <span
          style={{ background: '#f07000', color: '#ffffff', padding: '10px' }}
        >
          {'A WebGL Framework'}
        </span>
      </h1>
      <Router>
        <Routes>
          <Route
            path={'/'}
            element={
              <>
                <h2 style={{ marginLeft: '10px' }}>{'Examples'}</h2>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '10px',
                  }}
                >
                  <h3>{'WebGL2'}</h3>
                  <h4>{'2D'}</h4>
                  <Link to={'/webgl2/2d/colored-quad'}>{'Colored Quad'}</Link>
                  <h3>{'WebGPU'}</h3>
                  {Object.values(examples.webgpu)
                    .sort((a, b) => {
                      const category = a.category.localeCompare(b.category);
                      if (category === 0) {
                        return b.priority - a.priority;
                      }
                      return category;
                    })
                    .map(({ title, category, priority }, i) => (
                      <>
                        {priority === 0 && (
                          <h4>{capitalizeEveryWord(category)}</h4>
                        )}
                        <Link
                          key={i}
                          to={'/webgpu/' + snake(category) + '/' + snake(title)}
                        >
                          {title}
                        </Link>
                      </>
                    ))}
                </div>
              </>
            }
          />
          {/*** WebGL2 ***/}
          {/* 2D */}
          <Route
            path={'/webgl2/2d/colored-quad'}
            element={
              <ExampleWrapper
                title={'Colored Quad'}
                Component={examples.webgl2.ColoredQuad}
              />
            }
          />

          {/*** WebGPU ***/}
          {Object.values(examples.webgpu).map(
            ({ title, category, example }, i) => (
              <Route
                key={i}
                path={'/webgpu/' + snake(category) + '/' + snake(title)}
                element={<ExampleWrapper title={title} Component={example} />}
              />
            ),
          )}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
