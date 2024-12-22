#! /usr/bin/env npx tsx
// SPDX-License-Identifier: Apache-2.0
import { buildPackage } from './utils/buildPackage.js';

buildPackage().catch((error) => {
	console.error(error);
	process.exit(1);
});