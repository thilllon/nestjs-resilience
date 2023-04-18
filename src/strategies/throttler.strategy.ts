import { Strategy } from './base.strategy';
import { Observable } from 'rxjs';
import { ThrottlerException } from '../exceptions';

export interface ThrottlerOptions {
	ttl: number;
	limit: number;
}

export class ThrottlerStrategy extends Strategy<ThrottlerOptions> {
	private static readonly DEFAULT_OPTIONS: ThrottlerOptions = {
		ttl: 1000,
		limit: 10
	};

	private records: number[] = [];

	public constructor(options?: ThrottlerOptions) {
		super({ ...ThrottlerStrategy.DEFAULT_OPTIONS, ...options });

		if (this.options.ttl <= 0) {
			throw new RangeError('TTL must be greater than 0, got: ' + this.options.ttl);
		}

		if (this.options.limit <= 0) {
			throw new RangeError('Limit must be greater than 0, got: ' + this.options.limit);
		}
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		const now = Date.now();
		const expired = now - this.options.ttl;

		this.records = this.records.filter(record => record > expired);

		if (this.isLimitReached) {
			throw new ThrottlerException();
		}

		this.records.push(now);

		return observable;
	}

	private get isLimitReached(): boolean {
		return this.records.length >= this.options.limit;
	}
}
