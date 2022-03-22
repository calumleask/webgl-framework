import React from 'react';
import { Link, HashRouter as Router, Route, Routes } from 'react-router-dom';

import * as examples from './examples';

import './index.css';

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
                  <h4>{'Basic'}</h4>
                  <Link to={'/webgpu/3d/basic/cube'}>{'Cube'}</Link>
                  <Link to={'/webgpu/3d/basic/textured-cube'}>
                    {'Textured Cube'}
                  </Link>
                  <Link to={'/webgpu/3d/basic/many-cubes'}>{'Many Cubes'}</Link>
                  <h4>{'Transformations'}</h4>
                  <Link
                    to={'/webgpu/3d/transformations/rotating-around-local-axis'}
                  >
                    {'Rotating Around Local Axis'}
                  </Link>
                  <Link
                    to={
                      '/webgpu/3d/transformations/rotating-around-a-changing-axis'
                    }
                  >
                    {'Rotating Around a Changing Axis'}
                  </Link>
                  <h4>{'Camera'}</h4>
                  <Link to={'/webgpu/3d/camera/moving-camera'}>
                    {'Moving Camera'}
                  </Link>
                  <Link
                    to={'/webgpu/3d/camera/moving-camera-fixed-focal-point'}
                  >
                    {'Moving Camera (Fixed Focal Point)'}
                  </Link>
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
          {/* Basic */}
          <Route
            path={'/webgpu/3d/basic/cube'}
            element={
              <ExampleWrapper title={'Cube'} Component={examples.webgpu.Cube} />
            }
          />
          <Route
            path={'/webgpu/3d/basic/textured-cube'}
            element={
              <ExampleWrapper
                title={'Textured Cube'}
                Component={examples.webgpu.TexturedCube}
              />
            }
          />
          <Route
            path={'/webgpu/3d/basic/many-cubes'}
            element={
              <ExampleWrapper
                title={'Many Cubes'}
                Component={examples.webgpu.ManyCubes}
              />
            }
          />
          {/* Transformations */}
          <Route
            path={'/webgpu/3d/transformations/rotating-around-local-axis'}
            element={
              <ExampleWrapper
                title={'Rotating Around Local Axis'}
                Component={examples.webgpu.RotatingAroundLocalAxis}
              />
            }
          />
          <Route
            path={'/webgpu/3d/transformations/rotating-around-a-changing-axis'}
            element={
              <ExampleWrapper
                title={'Rotating Around a Changing Axis'}
                Component={examples.webgpu.RotatingAroundAChangingAxis}
              />
            }
          />
          {/* Camera */}
          <Route
            path={'/webgpu/3d/camera/moving-camera'}
            element={
              <ExampleWrapper
                title={'Moving Camera'}
                Component={examples.webgpu.MovingCamera}
              />
            }
          />
          <Route
            path={'/webgpu/3d/camera/moving-camera-fixed-focal-point'}
            element={
              <ExampleWrapper
                title={'Moving Camera (Fixed Focal Point)'}
                Component={examples.webgpu.MovingCameraFixedFocalPoint}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
