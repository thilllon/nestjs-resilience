import { Injectable, Type } from '@nestjs/common';
import { ResilienceFactory } from './resilience.factory';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class ResilienceService {
	public constructor(
		private readonly factory: ResilienceFactory,
		private readonly moduleRef: ModuleRef
	) {}

	public getCommand<T>(command: Type<T>): Promise<T> {
		return this.moduleRef.get(command, { strict: false });
	}
}
