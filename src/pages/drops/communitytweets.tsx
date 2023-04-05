/* eslint-disable react/no-unknown-property */
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

const Home: NextPage = () => {
	const pageTitle = `Meem`

	const Model = () => {
		const gltf = useGLTF('/drops/ct.glb')
		return <primitive object={gltf.scene} scale={0.8} />
	}

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
			</Head>
			<div>
				<Canvas
					shadows
					style={{
						backgroundColor: '#0C0C0C',
						width: '100%',
						height: '100%',
						position: 'absolute',
						left: 0,
						top: 0
					}}
				>
					<Model />
					<OrbitControls
						enableDamping={false}
						enablePan={false}
						enableRotate={false}
						enableZoom={false}
						autoRotate
						autoRotateSpeed={4}
					/>
					<Environment preset="forest" />
				</Canvas>
			</div>
		</>
	)
}

export default Home
