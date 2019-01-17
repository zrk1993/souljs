import * as Koa from 'koa';

export interface IRequest extends Koa.Request {}

export interface IResponse extends Koa.Response {}

export interface INext extends Function {}

export interface ICtx extends Koa.Context {}
