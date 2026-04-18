# API Endpoints

**Last Updated:** 2026-04-17T02:34:09.167865
**Total Endpoints:** 1003

## All Endpoints

1. `   4. Check app/api/qmoi-model.ts for TypeScript integration`
2. `  - Endpoints: {len(self.endpoints)}`
3. `  • GET  /api/health`
4. `  • GET  /api/media`
5. `  • POST /api/emergency`
6. `  • POST /api/files`
7. `  • POST /api/mail`
8. `  • POST /api/verify`
9. `  • POST /api/youtube/download`
10. `  ✅ Found {len(self.endpoints)} endpoints, {len(self.routes)} routes`
11. `# Auto-generated // production implementation complete:\nfrom fastapi import FastAPI\napp = FastAPI()\n@app.get(`
12. `# Auto-generated // production implementation complete:\nfrom fastapi import FastAPI\napp = FastAPI()\n@app.get(`
13. `# Auto-generated [production implementation complete]\nfrom fastapi import FastAPI\napp = FastAPI()\n@app.get(`
14. `# Auto-generated [production implementation complete]\nfrom fastapi import FastAPI\napp = FastAPI()\n@app.get(`
15. `# Auto-generated [production production REQUIRED]\nfrom fastapi import FastAPI\napp = FastAPI()\n@app.get(`
16. `### {method}\n`GET /api/{method}`\n\nDescription of {method} endpoint`
17. `**/api/**/*.ts`
18. `- GET /api/qmoi/autorate - Get autoration results\n`
19. `- GET /api/qmoi/benchmarks - Get benchmark scores\n`
20. `- POST /api/phase{phase.number}/feature{i} - {endpoint_name}\n`
21. `- POST /api/qmoi/heal-errors - Self-healing operations\n`
22. `- POST /api/qmoi/multimodal - Multimodal ingestion\n`
23. `- POST /api/qmoi/reasoning - Complex query reasoning\n`
24. `- POST /api/qmoi/verify-facts - Chain-of-Verification\n`
25. `- `GET /api/{path}`\n`
26. `- `GET/POST /api/{path}`\n`
27. `- app/api/production_STATUS.md`
28. `../../../app/api/ai-health/route.ts`
29. `../../../app/api/qmoi/language/route.ts`
30. `../../../app/api/qnews/route.ts`
31. `../../app/api/qmoi/avatars/route`
32. `../../app/api/qmoi/voice-profiles/route`
33. `../app/api/qmoi-model/route`
34. `../app/api/qmoi/chat/route`
35. `.next/server/app/api/ai-health/route.js`
36. `.next/server/app/api/qmoi/language/route.js`
37. `.next/server/app/api/qnews/route.js`
38. `/`
39. `/.netlify/functions/api/:splat`
40. `/admin/:path*`
41. `/admin/backup-db`
42. `/admin/check-access/<username>/<feature>`
43. `/admin/set-pricing`
44. `/admin/update-ngrok`
45. `/admin/users`
46. `/ai`
47. `/ai/tts`
48. `/alert`
49. `/analytics`
50. `/analytics/hourly`
51. `/api`
52. `/api/`
53. `/api/(.*)`
54. `/api/*`
55. `/api/activity/recent`
56. `/api/admin`
57. `/api/admin/`
58. `/api/admin/alerts`
59. `/api/admin/audit-logs`
60. `/api/admin/autofix/health`
61. `/api/admin/autofix/status`
62. `/api/admin/dashboard`
63. `/api/admin/master/auth`
64. `/api/admin/master/logout`
65. `/api/admin/monitoring`
66. `/api/admin/rate-limits`
67. `/api/admin/system-status`
68. `/api/admin/users`
69. `/api/ai`
70. `/api/ai error:`
71. `/api/ai-brain/process`
72. `/api/ai-health`
73. `/api/alerts`
74. `/api/analytics`
75. `/api/analytics/dashboard`
76. `/api/analytics/overview`
77. `/api/analytics/portfolio-performance`
78. `/api/analytics/transactions`
79. `/api/analytics/wallets`
80. `/api/analytics/{data_source}`
81. `/api/anomalies/detected`
82. `/api/anomalies/system-health`
83. `/api/apps`
84. `/api/audit`
85. `/api/auth/biometric/capture`
86. `/api/auth/login`
87. `/api/auth/logout`
88. `/api/auth/profile`
89. `/api/auth/refresh`
90. `/api/auth/register`
91. `/api/auth/settings`
92. `/api/auth/signin`
93. `/api/auth/signup`
94. `/api/auth/verify`
95. `/api/auto-enhance`
96. `/api/autodev/status`
97. `/api/automation/settings`
98. `/api/automation/status`
99. `/api/automation/tasks`
100. `/api/automl/train`
101. `/api/automl/train?dataset_id=1&target_column=target`
102. `/api/autoresearch/status`
103. `/api/biometric/register`
104. `/api/biometric/verify`
105. `/api/bitget-trade`
106. `/api/build-apps`
107. `/api/camera/upload`
108. `/api/chat`
109. `/api/chat/generate`
110. `/api/colab-job?executeJob=true`
111. `/api/community/best-practices`
112. `/api/community/rate-tool`
113. `/api/community/review-tool`
114. `/api/community/submit-tool`
115. `/api/community/tools`
116. `/api/compliance/check`
117. `/api/compliance/reports`
118. `/api/components`
119. `/api/confidence/assess`
120. `/api/cross-chain/bridges`
121. `/api/cross-chain/transfer`
122. `/api/datasets`
123. `/api/datasets/settings`
124. `/api/deploy/gpt2`
125. `/api/deploy/{model_name}`
126. `/api/discussions/`
127. `/api/doc-history`
128. `/api/docs`
129. `/api/edit-file`
130. `/api/emergency`
131. `/api/error-fix-log`
132. `/api/event-stats`
133. `/api/evolution/behavior-analysis`
134. `/api/evolution/capability-predictions`
135. `/api/evolution/community-contribution`
136. `/api/evolution/compare-models`
137. `/api/evolution/market-trends`
138. `/api/evolution/predict/{tool_name}`
139. `/api/evolution/recommendations`
140. `/api/evolution/replace-model`
141. `/api/evolution/status`
142. `/api/evolution/track-evolution`
143. `/api/explore`
144. `/api/files`
145. `/api/files/confirm-upload`
146. `/api/files/request-upload`
147. `/api/finetune/gpt2`
148. `/api/finetune/gpt2?dataset_id=1`
149. `/api/finetune/{model_name}`
150. `/api/games`
151. `/api/games/{game_id}/start`
152. `/api/generate`
153. `/api/global/edge/register`
154. `/api/global/failover/setup`
155. `/api/global/health`
156. `/api/global/multi-cloud/initialize`
157. `/api/global/sync/state`
158. `/api/health`
159. `/api/health/add-cloned-platform`
160. `/api/health/cloned-platforms`
161. `/api/health/comprehensive-domain-check`
162. `/api/health/enhance-platform-features`
163. `/api/health/lion-agent-workflow`
164. `/api/history`
165. `/api/inference/gpt2`
166. `/api/inference/nonexistent-model`
167. `/api/inference/{model_name}`
168. `/api/lion-agent/enhance-platforms`
169. `/api/lion-agent/orchestrate`
170. `/api/lion-agent/strategies`
171. `/api/lion-agent/tracks`
172. `/api/lion-agent/tracks/alerts/{alert_id}/resolve`
173. `/api/lion-agent/tracks/{track_type}`
174. `/api/lion-agent/validation/all-systems`
175. `/api/lion-agent/validation/md-files`
176. `/api/lion-agent/validation/orchestrate`
177. `/api/lion/chatbot/branch`
178. `/api/lion/chatbot/code-execute`
179. `/api/lion/chatbot/collaboration`
180. `/api/lion/chatbot/message`
181. `/api/lion/chatbot/suggestions`
182. `/api/lion/evolution/auto-enhance`
183. `/api/lion/evolution/auto-research`
184. `/api/lion/evolution/parallel-process`
185. `/api/lion/evolution/{evolution_type}`
186. `/api/lion/integrity-dashboard`
187. `/api/lion/network/sync`
188. `/api/lion/orchestration/control`
189. `/api/lion/status/comprehensive`
190. `/api/lion/status/update`
191. `/api/lion/status/{status_type}`
192. `/api/lion/variations/{variation}`
193. `/api/lion/vercel/fix`
194. `/api/lion/vercel/status`
195. `/api/lion/workflows/health`
196. `/api/local-proxies/analytics`
197. `/api/local-proxies/biometric`
198. `/api/local-proxies/exchange-rates`
199. `/api/local-proxies/ml-inference`
200. `/api/local-proxies/payments`
201. `/api/local-proxies/third-party`
202. `/api/local-proxies/video`
203. `/api/local-proxies/voice`
204. `/api/log`
205. `/api/log?search=`
206. `/api/logs`
207. `/api/mail`
208. `/api/map`
209. `/api/master/workflows-health`
210. `/api/md-update`
211. `/api/media`
212. `/api/media/:id`
213. `/api/media/generate`
214. `/api/media/logs`
215. `/api/media/settings`
216. `/api/media/status`
217. `/api/memory`
218. `/api/models`
219. `/api/models?action=compare&id1=`
220. `/api/monitor`
221. `/api/monitoring`
222. `/api/monitoring/metrics`
223. `/api/notifications`
224. `/api/notifications/`
225. `/api/notifications/test`
226. `/api/notifications/{notification_id}/read`
227. `/api/production data`
228. `/api/orchestration/create`
229. `/api/orchestration/cross-platform/deploy`
230. `/api/orchestration/execute/{orchestration_id}`
231. `/api/orchestration/executions`
232. `/api/orchestration/status/{orchestration_id}`
233. `/api/orchestration/workflow/create`
234. `/api/orchestration/workflow/execute`
235. `/api/orchestration/workflow/optimize`
236. `/api/payments`
237. `/api/payments/initiate`
238. `/api/performance`
239. `/api/plans/`
240. `/api/plans/{plan_id}`
241. `/api/preautotest`
242. `/api/predictions`
243. `/api/predictive/generate`
244. `/api/predictive/insights`
245. `/api/predictive/train-model`
246. `/api/prodice/detect`
247. `/api/prodice/master-mode`
248. `/api/prodice/reports/detection`
249. `/api/prodice/reports/unlock`
250. `/api/prodice/status`
251. `/api/prodice/status/integration`
252. `/api/prodice/unlock`
253. `/api/production`
254. `/api/projects`
255. `/api/projects/active`
256. `/api/provider`
257. `/api/pwa/auto-update`
258. `/api/pwa/check-update`
259. `/api/qcity/ai-chat`
260. `/api/qcity/ai/fix`
261. `/api/qcity/backup`
262. `/api/qcity/config`
263. `/api/qcity/configure-platforms`
264. `/api/qcity/enable-features`
265. `/api/qcity/logs`
266. `/api/qcity/manage-backup`
267. `/api/qcity/monitor-resources`
268. `/api/qcity/notifications`
269. `/api/qcity/optimize-resources`
270. `/api/qcity/projects`
271. `/api/qcity/projects/config`
272. `/api/qcity/resources`
273. `/api/qcity/start`
274. `/api/qcity/status`
275. `/api/qcity/stop`
276. `/api/qcity/tasks`
277. `/api/qcity/track-error`
278. `/api/qcity/trading/config`
279. `/api/qcity/trading/positions`
280. `/api/qcity/whatsapp/config`
281. `/api/qcity/whatsapp/messages`
282. `/api/qmoi`
283. `/api/qmoi-database`
284. `/api/qmoi-master/accountability-check`
285. `/api/qmoi-master/autonomous-clone`
286. `/api/qmoi-master/autonomous-evolution`
287. `/api/qmoi-master/global-memory`
288. `/api/qmoi-master/initialize-consciousness`
289. `/api/qmoi-master/optimize-paid-features`
290. `/api/qmoi-master/platform-states`
291. `/api/qmoi-master/sync-memory`
292. `/api/qmoi-model`
293. `/api/qmoi-model?analytics=1`
294. `/api/qmoi-model?applyprodiceFeature=1`
295. `/api/qmoi-model?autoEarning=1`
296. `/api/qmoi-model?colabJob=1`
297. `/api/qmoi-model?featureEnhance=1`
298. `/api/qmoi-model?githubTasks=1`
299. `/api/qmoi-model?globalScanFix=1`
300. `/api/qmoi-model?hookDiagnostics=1`
301. `/api/qmoi-model?manageRepo=1`
302. `/api/qmoi-model?prodiceOptimize=1`
303. `/api/qmoi-model?runEarningTask=1`
304. `/api/qmoi-model?trainingStatus=1`
305. `/api/qmoi/aggregate`
306. `/api/qmoi/analytics`
307. `/api/qmoi/auto-setup`
308. `/api/qmoi/autoprod`
309. `/api/qmoi/autoprod/generate-feature`
310. `/api/qmoi/autoprod/research`
311. `/api/qmoi/autoprod/suggestions`
312. `/api/qmoi/autoprod/toggle`
313. `/api/qmoi/autoprod/toggle + generate-feature + state`
314. `/api/qmoi/avatar`
315. `/api/qmoi/avatars and /api/qmoi/voice-profiles auto endpoints`
316. `/api/qmoi/capabilities`
317. `/api/qmoi/chat`
318. `/api/qmoi/chat route`
319. `/api/qmoi/consciousness`
320. `/api/qmoi/consciousness/interact`
321. `/api/qmoi/consciousness/status`
322. `/api/qmoi/deal`
323. `/api/qmoi/debate`
324. `/api/qmoi/download-exe`
325. `/api/qmoi/error-log`
326. `/api/qmoi/files`
327. `/api/qmoi/files/upload`
328. `/api/qmoi/friendship`
329. `/api/qmoi/gaming`
330. `/api/qmoi/infer`
331. `/api/qmoi/language`
332. `/api/qmoi/lion/autonomous-validation`
333. `/api/qmoi/lion/cross-platform-validation`
334. `/api/qmoi/lion/multi-modal-validation`
335. `/api/qmoi/lion/predictive-validation`
336. `/api/qmoi/lion/universal-validation`
337. `/api/qmoi/lion/validation-analytics`
338. `/api/qmoi/lion/validation-automation`
339. `/api/qmoi/lion/validation-debate`
340. `/api/qmoi/lion/validation-memory-sync`
341. `/api/qmoi/lion/validation-orchestration`
342. `/api/qmoi/lion/validation-orchestration-engine`
343. `/api/qmoi/memory`
344. `/api/qmoi/memory/{key}`
345. `/api/qmoi/notify-master`
346. `/api/qmoi/payload`
347. `/api/qmoi/payload?qfix=1`
348. `/api/qmoi/platforms`
349. `/api/qmoi/project`
350. `/api/qmoi/projects`
351. `/api/qmoi/research`
352. `/api/qmoi/revenue`
353. `/api/qmoi/self-modify`
354. `/api/qmoi/self-work/code-review`
355. `/api/qmoi/self-work/debug`
356. `/api/qmoi/self-work/run-tests`
357. `/api/qmoi/status`
358. `/api/qmoi/validate/system`
359. `/api/qmoi/vision`
360. `/api/qmoi/voice`
361. `/api/qmoi/voice-PRODUCTION`
362. `/api/qmoi/voice-PRODUCTION`
363. `/api/qmoi/voice/process`
364. `/api/qmoi/voice/status?userId=`
365. `/api/qstore`
366. `/api/qvillage`
367. `/api/qvillage-evolution/autonomous-evolution`
368. `/api/qvillage-evolution/community-contribution`
369. `/api/qvillage-evolution/initialize`
370. `/api/qvillage-evolution/multi-tool-orchestration`
371. `/api/qvillage-evolution/predictive-evolution`
372. `/api/qvillage-evolution/tool-ecosystem`
373. `/api/qvillage-spaces/cross-platform-continuity`
374. `/api/qvillage-spaces/global-memory-sync`
375. `/api/qvillage-spaces/initialize-runtime`
376. `/api/qvillage-spaces/offline-first`
377. `/api/qvillage-spaces/parallel-processing`
378. `/api/qvillage-spaces/runtime-status`
379. `/api/qvillage/ai-agent/execute`
380. `/api/qvillage/autofix`
381. `/api/qvillage/automl/train`
382. `/api/qvillage/autosync`
383. `/api/qvillage/compute/allocate`
384. `/api/qvillage/conversation/{conversation_id}/continue`
385. `/api/qvillage/conversation/{conversation_id}/history`
386. `/api/qvillage/custom-domain/{space_id}`
387. `/api/qvillage/economy/{transaction_type}`
388. `/api/qvillage/enhanced/initialize`
389. `/api/qvillage/enhanced/status`
390. `/api/qvillage/features`
391. `/api/qvillage/health`
392. `/api/qvillage/knowledge-graph/query`
393. `/api/qvillage/knowledge/search`
394. `/api/qvillage/paid-features`
395. `/api/qvillage/qvs/stats`
396. `/api/qvillage/registry/{action}`
397. `/api/qvillage/self-healing/status`
398. `/api/qvillage/self-training/update`
399. `/api/qvillage/spaces/1/execute`
400. `/api/qvillage/spaces/{space_id}/execute`
401. `/api/qvillage/unified/{modality}`
402. `/api/qvillage/unlimited/inference`
403. `/api/qvillage/unlimited/model`
404. `/api/qvillage/unlimited/space`
405. `/api/qvillage/whatsapp/send`
406. `/api/qvillage?endpoint=analyze`
407. `/api/qvillage?endpoint=datasets`
408. `/api/qvillage?endpoint=discussions`
409. `/api/qvillage?endpoint=kb`
410. `/api/qvillage?endpoint=metrics`
411. `/api/qvillage?endpoint=papers`
412. `/api/qvillage?endpoint=search`
413. `/api/qvillage?endpoint=sync`
414. `/api/rate`
415. `/api/real`
416. `/api/redoc`
417. `/api/repo-sync`
418. `/api/report`
419. `/api/research/daily-papers`
420. `/api/research/search`
421. `/api/research/search?query=deep%20learning`
422. `/api/restart/<component>`
423. `/api/revenue`
424. `/api/revenue/add`
425. `/api/revenue/allocate`
426. `/api/revenue/current`
427. `/api/revenue/overview`
428. `/api/risk/assessment`
429. `/api/risk/limits`
430. `/api/run-command`
431. `/api/security/audit-log`
432. `/api/security/audit-logs`
433. `/api/security/check-access`
434. `/api/security/dashboard`
435. `/api/security/decrypt`
436. `/api/security/encrypt`
437. `/api/security/initialize`
438. `/api/security/log-event`
439. `/api/self-training?action=start`
440. `/api/spot/v1/account/assets`
441. `/api/stats`
442. `/api/status`
443. `/api/system/metrics`
444. `/api/system/status`
445. `/api/tasks`
446. `/api/tasks/queue`
447. `/api/tasks/settings`
448. `/api/test`
449. `/api/tracks`
450. `/api/trading/crypto/buy`
451. `/api/trading/crypto/sell`
452. `/api/trading/orders`
453. `/api/trading/portfolio`
454. `/api/trading/settings`
455. `/api/trading/status`
456. `/api/trading/toggle`
457. `/api/trigger-fix`
458. `/api/upload`
459. `/api/user/profile`
460. `/api/users`
461. `/api/users/profile`
462. `/api/v1`
463. `/api/v2/mix/market/tickers?productType=USDT-FUTURES`
464. `/api/v2/mix/order/history?productType=USDT-FUTURES`
465. `/api/v2/mix/order/placeOrder`
466. `/api/v2/spot/account/assets`
467. `/api/v2/spot/market/ticker?symbol={symbol}USDT`
468. `/api/validation/system`
469. `/api/vercel/clone`
470. `/api/vercel/fix`
471. `/api/vercel/health`
472. `/api/vercel/recovery`
473. `/api/vercel/redeploy`
474. `/api/verify`
475. `/api/version`
476. `/api/voice/process`
477. `/api/voice/verify`
478. `/api/wallets`
479. `/api/wallets/<name>`
480. `/api/webauthn/register`
481. `/api/webhooks/plaid`
482. `/api/webhooks/qvillage`
483. `/api/webhooks/stripe`
484. `/api/whatsapp/create-group`
485. `/api/whatsapp/notify-master`
486. `/api/whatsapp/post-to-group`
487. `/api/workflows/health`
488. `/api/ws/connect`
489. `/api/youtube/download`
490. `/app/api/`
491. `/app/api/$1`
492. `/attachments`
493. `/attachments/<att_id>/download`
494. `/auth/token`
495. `/automation/config`
496. `/automation/history`
497. `/automation/metrics`
498. `/automation/optimize`
499. `/automation/start`
500. `/automation/status`
501. `/automation/stop`
502. `/automation/tasks`
503. `/automation/trends`
504. `/balance`
505. `/config`
506. `/configure-platforms`
507. `/control`
508. `/datasets/`
509. `/datasets/{dataset_id}`
510. `/deals`
511. `/deals/<deal_id>`
512. `/deals/<deal_id>/activate`
513. `/deals/<deal_id>/deactivate`
514. `/deals/<deal_id>/execute`
515. `/deals/<deal_id>/purchase`
516. `/deals/<deal_id>/revenue`
517. `/deals/create`
518. `/deals/optimize`
519. `/deals/revenue`
520. `/deploy/auto`
521. `/detect-anomaly`
522. `/enable-features`
523. `/export-analytics`
524. `/fix/auto`
525. `/fix_error`
526. `/health`
527. `/health/routes`
528. `/links/broken`
529. `/links/warnings`
530. `/login`
531. `/logout`
532. `/logs`
533. `/memories`
534. `/metrics`
535. `/mirror/app/<appname>/`
536. `/mirror/app/<appname>/<path:rest>`
537. `/mirror/raw/<path:rest>`
538. `/model/info`
539. `/models/`
540. `/models/{model_id}`
541. `/monitor`
542. `/monitor-resources`
543. `/monitor/status`
544. `/news/aggregate`
545. `/news/fetch`
546. `/news/sentiment-correlation`
547. `/notifications`
548. `/parallel/process`
549. `/parallel/status/{processing_id}`
550. `/parse-log`
551. `/payments/webhook`
552. `/ping`
553. `/predict`
554. `/predict/batch`
555. `/qmessage`
556. `/qmoi/success/analysis`
557. `/qmoi/success/auto-fix`
558. `/qmoi/success/ensure`
559. `/qmoi/success/metrics`
560. `/qmoi/success/predict`
561. `/qvs/create`
562. `/qvs/{space_id}/enhance`
563. `/ready`
564. `/resources`
565. `/sentiment/analyze`
566. `/sentiment/monitor`
567. `/sentiment/score`
568. `/sentiment/trends`
569. `/signup`
570. `/spaces/`
571. `/spaces/templates`
572. `/spaces/{space_id}`
573. `/spaces/{space_id}/backup`
574. `/spaces/{space_id}/clone`
575. `/spaces/{space_id}/collaborators`
576. `/spaces/{space_id}/collaborators/{collaborator_id}`
577. `/spaces/{space_id}/metrics`
578. `/spaces/{space_id}/pause`
579. `/spaces/{space_id}/restore`
580. `/spaces/{space_id}/resume`
581. `/spaces/{space_id}/scale`
582. `/sponsored/add`
583. `/start`
584. `/status`
585. `/stop`
586. `/sync-memory`
587. `/tasks`
588. `/token`
589. `/wallet`
590. `/wallet/credit`
591. `/wallet/debit`
592. `/webauthn/authenticate/complete`
593. `/webauthn/authenticate/options`
594. `/webauthn/register/complete`
595. `/webauthn/register/options`
596. `/workspace-logs`
597. `/workspaces/qmoi-enhanced/app/api/workflow/route.ts`
598. `/ws`
599. `3000`
600. `@/app/api/auth/register/route`
601. `@/app/api/middleware/roleAuth`
602. `@/app/api/payments/initiate/route`
603. `@/app/api/wallets/route`
604. `@/app/api/webhooks/payments/route`
605. `@/src/app/api/qmoi/autoprod/generate-feature/route`
606. `@/src/app/api/qmoi/autoprod/research/route`
607. `@/src/app/api/qmoi/autoprod/state/route`
608. `@/src/app/api/qmoi/autoprod/toggle/route`
609. `@app.`
610. `@app.delete`
611. `@app.get`
612. `@app.patch`
613. `@app.post`
614. `@app.put`
615. `@router\.(?:get|post|put|delete)\([\`
616. `@router\.(?:get|post|put|delete|patch)\([\`
617. `@router\.route\(([\`
618. `Add route /api/qmoi/errors in backend`
619. `Check /api/vercel/health after redeploy`
620. `Checking UI proxy /api/qmoi/chat...`
621. `Checking UI proxy /api/qmoi/chat/* Production implementation with proper error handling */`
622. `DELETE /api/wallets/:walletId _error:`
623. `Error in /api/notifications/test`
624. `Error in /api/qmoi/chat:`
625. `Error testing API endpoints: {e}`
626. `GET`
627. `GET /api/accountability?action=events should return events list`
628. `GET /api/admin/alerts - Should get system alerts`
629. `GET /api/admin/audit-logs - Should retrieve audit logs`
630. `GET /api/admin/dashboard - Should return dashboard stats`
631. `GET /api/admin/system-status`
632. `GET /api/admin/users`
633. `GET /api/admin/users - Should list all users (admin only)`
634. `GET /api/ai/agents should list tools`
635. `GET /api/analytics/dashboard`
636. `GET /api/analytics/portfolio-performance`
637. `GET /api/analytics/transactions - Should return transaction analytics`
638. `GET /api/analytics/wallets - Should return wallet analytics`
639. `GET /api/anomalies/detected`
640. `GET /api/anomalies/system-health`
641. `GET /api/auth/verify - Verify authentication token`
642. `GET /api/auth/verify - Verify token`
643. `GET /api/auto/report - Automation report`
644. `GET /api/auto/status - Automation status`
645. `GET /api/confidence/factors - Get confidence factors`
646. `GET /api/confidence/report - Get confidence report`
647. `GET /api/cross-chain/bridges`
648. `GET /api/data/backup - Create backup`
649. `GET /api/data/export - Export system data`
650. `GET /api/domains/health - Get domain health status`
651. `GET /api/domains/report - Generate domain health report`
652. `GET /api/evolution/behavior-analysis - Analyze system behavior`
653. `GET /api/evolution/market-trends - Get market trends`
654. `GET /api/global-links?action=health-reports should return structured reports`
655. `GET /api/global-links?action=links-by-health should validate query parameters and results`
656. `GET /api/global-links?action=stats should return accessibility stats`
657. `GET /api/global-news?action=recent should return list`
658. `GET /api/global/health - Get global health status`
659. `GET /api/global?action=countries should return countries list`
660. `GET /api/global?action=stats should return success and stats data`
661. `GET /api/health/domains - Domain health overview`
662. `GET /api/health/production - production readiness status`
663. `GET /api/health/system - System health check`
664. `GET /api/health/telemetry - System telemetry data`
665. `GET /api/knowledge?action=graph should return stats`
666. `GET /api/knowledge?action=sources should return sources`
667. `GET /api/models lists models`
668. `GET /api/monitor/alerts - Active alerts`
669. `GET /api/monitor/logs - System logs`
670. `GET /api/monitor/metrics - Performance metrics`
671. `GET /api/orchestration/executions - Get execution history`
672. `GET /api/qi-spaces?action=dashboard should return success or 404`
673. `GET /api/qi-spaces?action=regions should return region summary`
674. `GET /api/qmoi/consciousness/status`
675. `GET /api/qmoi/status (path-only) returns 200 and payload`
676. `GET /api/qvs?action=health should return QVS health snapshot`
677. `GET /api/qvs?action=stats should return QVS statistics`
678. `GET /api/reports/compliance - Compliance reports`
679. `GET /api/reports/health - Health reports`
680. `GET /api/reports/performance - Performance reports`
681. `GET /api/reports/production - production reports`
682. `GET /api/revenue/balance - Get revenue balance`
683. `GET /api/revenue/history - Get transaction history`
684. `GET /api/risk/assessment`
685. `GET /api/risk/limits`
686. `GET /api/self-training?action=list returns tasks`
687. `GET /api/trading/portfolio`
688. `GET /api/trading/portfolio - Get portfolio overview`
689. `GET /api/trading/positions - Get current positions`
690. `GET /api/transactions _error:`
691. `GET /api/users/profile`
692. `GET /api/users/profile - Should return user profile`
693. `GET /api/users/profile _error:`
694. `GET /api/wallets`
695. `GET /api/wallets _error:`
696. `GET /api/wallets/:walletId _error:`
697. `GET absolute URL https://qmoi.ai/api/qmoi/status returns 200`
698. `GET absolute URL https://production.qmoi.ai/api/qmoi/status returns 200`
699. `GET absolute URL https://qmoi.ai/api/qmoi/status returns 200`
700. `HOOK: fetchStatus - calling /api/qmoi/status`
701. `Health Check`
702. `POST`
703. `POST /api/accountability should capture event`
704. `POST /api/ai/agents handles unknown commands gracefully`
705. `POST /api/ai/agents should execute known command`
706. `POST /api/auth/login`
707. `POST /api/auth/login - Should authenticate user`
708. `POST /api/auth/login - User login`
709. `POST /api/auth/login - User login with credentials`
710. `POST /api/auth/logout`
711. `POST /api/auth/logout - Should logout user`
712. `POST /api/auth/logout - User logout`
713. `POST /api/auth/refresh`
714. `POST /api/auth/refresh - Refresh token`
715. `POST /api/auth/register`
716. `POST /api/auth/register - Should register a new user`
717. `POST /api/auth/register - User registration`
718. `POST /api/auto/fix - Auto-fix issues`
719. `POST /api/auto/scan - Run production scan`
720. `POST /api/biometric/register - Should register biometric`
721. `POST /api/biometric/verify - Should verify biometric`
722. `POST /api/confidence/assess - Assess confidence for deployment`
723. `POST /api/confidence/deploy - Deploy with confidence check`
724. `POST /api/cross-chain/transfer`
725. `POST /api/data/import - Import data`
726. `POST /api/data/restore - Restore from backup`
727. `POST /api/domains/check - Check specific domain`
728. `POST /api/domains/failover - Initiate domain failover`
729. `POST /api/evolution/community-contribution - Submit contribution`
730. `POST /api/global action=start-operation should enqueue a global operation`
731. `POST /api/global-links with action=ensure-accessibility should update a link status`
732. `POST /api/global-links with action=perform-health-check should return completion`
733. `POST /api/global-news should capture news item`
734. `POST /api/global/edge/register - Register edge node`
735. `POST /api/global/multi-cloud/initialize - Setup multi-cloud`
736. `POST /api/knowledge?action=add should create a source`
737. `POST /api/knowledge?action=index should index a source`
738. `POST /api/knowledge?action=qa should return answer`
739. `POST /api/knowledge?action=search should return results`
740. `POST /api/models creates model`
741. `POST /api/monitor/test - Test monitoring systems`
742. `POST /api/orchestration/workflow/create - Create workflow`
743. `POST /api/orchestration/workflow/execute - Execute workflow`
744. `POST /api/payments/initiate`
745. `POST /api/payments/initiate - Should initiate payment`
746. `POST /api/qi-spaces action=refresh-global-health should trigger check`
747. `POST /api/qi-spaces action=trigger-auto-evolve should return result structure`
748. `POST /api/qmoi/consciousness/interact`
749. `POST /api/qmoi/payload?qfix returns QFix message`
750. `POST /api/qvs action=configure should accept configuration`
751. `POST /api/revenue/allocate - Allocate funds to platforms`
752. `POST /api/revenue/withdraw - Withdraw funds`
753. `POST /api/self-training?action=start enqueues a task`
754. `POST /api/self-training?action=start rejects required model`
755. `POST /api/trading/crypto/buy - Buy cryptocurrency`
756. `POST /api/trading/crypto/sell - Sell cryptocurrency`
757. `POST /api/trading/orders`
758. `POST /api/trading/stocks/buy - Buy stocks`
759. `POST /api/trading/stocks/sell - Sell stocks`
760. `POST /api/users/api-key`
761. `POST /api/wallets`
762. `POST /api/wallets _error:`
763. `POST /api/webhooks/stripe`
764. `PUT`
765. `PUT /api/users/profile`
766. `PUT /api/users/profile - Should update user profile`
767. `PUT /api/users/profile _error:`
768. `PUT /api/wallets/:walletId _error:`
769. `Production validation:`
770. `Production:`
771. `QMOI /api/ai Bridge`
772. `QMOI /api/qmoi/chat proxy`
773. `QMOI_DISCORD_WEBHOOK`
774. `QMOI_WHATSAPP_ENDPOINT`
775. `QueueTimeOutURL`
776. `ResultURL`
777. `Should handle production scenarios:`
778. `Unable to reach /api/health to perform scan`
779. `Use /api/lion/vercel/status for Lion health summary`
780. `[+] Found {len(self.endpoints)} unique endpoints`
781. `[+] Updated ENDPOINTS.md with {len(self.endpoints)} endpoints`
782. `[\`
783. `\n   Test health: curl https://qmoi-enhanced.vercel.app/api/health`
784. `__main__`
785. ``/api/`
786. `app/api/**/*.js`
787. `app/api/**/route.ts`
788. `app/api/*/route.ts`
789. `app/api/ai-health/route.ts`
790. `app/api/auth/[...nextauth].ts or equivalent`
791. `app/api/auth/[/* Production implementation with proper error handling */nextauth].ts or equivalent`
792. `app/api/autosync/route.ts`
793. `app/api/cameras/infrared/route.ts`
794. `app/api/cameras/panoramic/route.ts`
795. `app/api/cameras/road/route.ts`
796. `app/api/cameras/route.ts`
797. `app/api/cameras/street/route.ts`
798. `app/api/cameras/thermal/route.ts`
799. `app/api/consciousness/route.ts`
800. `app/api/health/route.ts`
801. `app/api/memory/route.ts`
802. `app/api/qmoi-model.ts`
803. `app/api/qmoi/language/route.ts`
804. `app/api/qnews/route.ts`
805. `app/api/workflow/route.ts`
806. `avatar-management`
807. `check_endpoints`
808. `classifyLinkType picks api for /api/`
809. `code_generation`
810. `curl`
811. `endpoint_url`
812. `endpoints`
813. `error-auto-fix`
814. `export async function delete`
815. `export async function get`
816. `export async function patch`
817. `export async function post`
818. `export async function put`
819. `find src/app/api -name `
820. `full`
821. `futures`
822. `github-integration`
823. `has_api_endpoints`
824. `health_check_url`
825. `health_url`
826. `http://`
827. `https://prod.qmoi.ai:3000/api/qmoi/status`
828. `https://prod.qmoi.ai:3000/health`
829. `https://prod.qmoi.ai:4040/api/tunnels`
830. `https://api.qmoi.prod/api/health`
831. `https://export.arxiv.org/api/query`
832. `https://export.arxiv.org/api/query?`
833. `https://export.arxiv.org/api/query?search_query=ai&start=0&max_results=10`
834. `https://export.arxiv.org/api/query?search_query=test&start=0&max_results=1`
835. `https://qmoi.ai/api/qmoi/chat`
836. `https://qmoi.ai/api/qmoi/status`
837. `https://qmoi.ai/api/test`
838. `https://qmoi.ai:3000/api/ai-self-diagnostics?fix=1`
839. `https://qmoi.ai:3000/api/auth/register`
840. `https://qmoi.ai:3000/api/financial/verify`
841. `https://qmoi.ai:3000/api/health`
842. `https://qmoi.ai:3000/api/qcity/audit-log`
843. `https://qmoi.ai:3000/api/qcity/remote-command`
844. `https://qmoi.ai:3000/api/qcity/status`
845. `https://qmoi.ai:3000/api/qmoi-model?allStats=true`
846. `https://qmoi.ai:3000/api/qmoi/chat`
847. `https://qmoi.ai:3000/api/qvillage`
848. `https://qmoi.ai:3000/api/whatsapp-bot?send=1`
849. `https://qmoi.ai:3000/api/whatsapp/verify`
850. `https://qmoi.ai:3001/api/ai`
851. `https://qmoi.ai:4000/api/error-fix-log`
852. `https://qmoi.ai:4040/api/tunnels`
853. `https://qmoi.ai:4100/api/predictions`
854. `https://qmoi.ai:\1`
855. `https://qmoi.ai:3000/api/health`
856. `https://test/api/qmoi/autoprod/generate-feature`
857. `https://test/api/qmoi/autoprod/research`
858. `https://test/api/qmoi/autoprod/state`
859. `https://test/api/qmoi/autoprod/toggle`
860. `https://test/api/qmoi/avatars`
861. `https://test/api/qmoi/voice-profiles`
862. `http:process.env.API_HOST || `
863. `https://`
864. `https:// production implementation:.pesapal.com/api/PostPesapalDirectOrderV4`
865. `https://([a-z0-9\-\.]+/api/health)\)(?=\s|$)`
866. `https://ai.qmoi.com/api/email/process`
867. `https://alphaq.ai/api/status`
868. `https://api.abuseipdb.com/api/v2/check?ipAddress={ip}`
869. `https://api.bitget.com/api/spot/v1/account/getInfo`
870. `https://api.bitget.com/api/spot/v1/trade/orders`
871. `https://api.bitget.com/api/v2/spot/account/assets`
872. `https://api.bitget.com/api/v2/spot/account/ip-whitelist`
873. `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`
874. `https://api.coingecko.com/api/v3/sophisticated/price?ids=bitcoin&vs_currencies=usd`
875. `https://api.netlify.com/api/v1`
876. `https://automation.qmoi.com/api/create_email`
877. `https://dagshub.com/api/v1`
878. `https://data.com/api/login`
879. `https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK`
880. `https://export.arxiv.org/api/query`
881. `https://export.arxiv.org/api/query?`
882. `https://export.arxiv.org/api/query?search_query=ai&start=0&max_results=10`
883. `https://export.arxiv.org/api/query?search_query=test&start=0&max_results=1`
884. `https://gitlab.com/api/v4`
885. `https://gitlab.com/api/v4/projects/{gitlab_project_id}/issues`
886. `https://huggingface.co/api/models`
887. `https://huggingface.co/api/models?limit=1`
888. `https://huggingface.co/api/models?sort=downloads&direction=-1&limit=10`
889. `https://huggingface.co/api/repos/{hf_repo}/commit`
890. `https://huggingface.co/api/repos/{self.config.org_name}/{self.config.repo_name}/webhooks`
891. `https://master.qmoi.com/api/auth`
892. `https://master.qmoi.com/api/emails`
893. `https://prod.qmoi.ai:3000/api/qmoi/status`
894. `https://prod.qmoi.ai:3000/health`
895. `https://prod.qmoi.ai:4040/api/tunnels`
896. `https://production.qmoi.ai/api/qmoi/chat`
897. `https://production.qmoi.ai/api/qmoi/status`
898. `https://production.qmoi.ai:3000/api/ai-self-diagnostics?fix=1`
899. `https://production.qmoi.ai:3000/api/auth/register`
900. `https://production.qmoi.ai:3000/api/financial/verify`
901. `https://production.qmoi.ai:3000/api/qcity/remote-command`
902. `https://production.qmoi.ai:3000/api/qcity/status`
903. `https://production.qmoi.ai:3000/api/qmoi-model?allStats=true`
904. `https://production.qmoi.ai:3000/api/qmoi/chat`
905. `https://production.qmoi.ai:3000/api/qvillage`
906. `https://production.qmoi.ai:3000/api/whatsapp-bot?send=1`
907. `https://production.qmoi.ai:3000/api/whatsapp/verify`
908. `https://production.qmoi.ai:3001/api/ai`
909. `https://production.qmoi.ai:4000/api/error-fix-log`
910. `https://production.qmoi.ai:4100/api/predictions`
911. `https://production.qmoi.ai:\1`
912. `https://qcity.ai/api/zero-rated-endpoints`
913. `https://qdatabase.net/api/health`
914. `https://qmoi.ai/api/qmoi-tracks`
915. `https://qmoi.ai/api/qmoi/chat`
916. `https://qmoi.ai/api/qmoi/status`
917. `https://qmoi.ai/api/status`
918. `https://qmoi.ai/api/test`
919. `https://qmoi.ai:3000/api/auth/register`
920. `https://qmoi.ai:3000/api/financial/verify`
921. `https://qmoi.ai:3000/api/health`
922. `https://qmoi.ai:3000/api/qcity/audit-log`
923. `https://qmoi.ai:3000/api/qcity/remote-command`
924. `https://qmoi.ai:3000/api/qcity/status`
925. `https://qmoi.ai:3000/api/qmoi-model?allStats=true`
926. `https://qmoi.ai:3000/api/qmoi/chat`
927. `https://qmoi.ai:3000/api/qvillage`
928. `https://qmoi.ai:3000/api/whatsapp-bot?send=1`
929. `https://qmoi.ai:3000/api/whatsapp/verify`
930. `https://qmoi.ai:3001/api/ai`
931. `https://qmoi.ai:4000/api/error-fix-log`
932. `https://qmoi.ai:4040/api/tunnels`
933. `https://qmoi.ai:4100/api/predictions`
934. `https://qmoi.ai:\1`
935. `https://qvillage.com/api/health`
936. `https://stableq.ai/api/status`
937. `https://test/api/qmoi/autoprod/generate-feature`
938. `https://test/api/qmoi/autoprod/research`
939. `https://test/api/qmoi/autoprod/state`
940. `https://test/api/qmoi/autoprod/toggle`
941. `https://test/api/qmoi/avatars`
942. `https://test/api/qmoi/voice-profiles`
943. `https://timeapi.io/api/Time/current/zone?timeZone=Africa/Nairobi`
944. `https://worldtimeapi.org/api/timezone/Africa/Nairobi`
945. `https://www.pesapal.com/api/PostPesapalDirectOrderV4`
946. `https://your-domain.com/api/airtel/callback`
947. `https://your-domain.com/api/mpesa/callback`
948. `https://your-domain.com/api/mpesa/result`
949. `https://your-domain.com/api/mpesa/timeout`
950. `https://your-domain.com/api/pesapal/callback`
951. `https://{domain}/api/health`
952. `https:[production READY].pesapal.com/api/PostPesapalDirectOrderV4`
953. `live`
954. `qmoi.ai:3000`
955. `master`
956. `memory-management`
957. `message`
958. `multi_modal`
959. `next_step`
960. `path`
961. `process.env.API_URL || `
962. `production.qmoi.ai:3000`
963. `qmoi.ai:3000`
964. `requests`
965. `shutdown`
966. `source_files`
967. `speech_processing`
968. `spot`
969. `src`
970. `src/api/routes/selfwork.ts:89`
971. `src/app/api/`
972. `startup`
973. `text_generation`
974. `ui_endpoints`
975. `unknown`
976. `url`
977. `video_processing`
978. `vision_analysis`
979. `{base_url}/v3/api/Auth/RequestToken`
980. `{self.base_url}/api/status`
981. `{self.bitget_api}/api/spot/v1/account/getInfo`
982. `{self.gitlab_url}/api/v4/projects/{self.project_id}/issues`
983. `{self.gitlab_url}/api/v4/projects/{self.project_id}/merge_requests`
984. `{self.gitlab_url}/api/v4/projects/{self.project_id}/merge_requests/{mr_id}/merge`
985. `{self.gitlab_url}/api/v4/projects/{self.project_id}/pipeline`
986. `{self.gitlab_url}/api/v4/projects/{self.project_id}/pipelines`
987. `{self.gitlab_url}/api/v4/projects/{self.project_id}/pipelines/{pipeline_id}`
988. `{self.gitlab_url}/api/v4/projects/{self.project_id}/pipelines/{pipeline_id}/jobs`
989. `{self.hf_space_url}/api/engagement`
990. `{self.hf_space_url}/api/papers/batch`
991. `{self.hf_space_url}/api/papers/count`
992. `{self.qmoi_memory_url}/api/events/batch`
993. `{self.qvillage_url}/api/engagement/batch`
994. `{self.qvillage_url}/api/papers/all`
995. `{self.qvillage_url}/api/papers/count`
996. `{self.qvillage_url}/api/sync/conflicts/{conflict[`
997. `{self.qvillage_url}/api/sync/conflicts?status=unresolved`
998. `{self.qvillage_url}/api/users/active?limit=100`
999. `{self.qvillage_url}/api/users/{user_id}/contributions`
1000. `{timestamp}POST/api/spot/v1/trade/orders`
1001. `{url}/api/health`
1002. `| {i} | GET/POST | `/api/{endpoint}` | {file_path} | ✅ |\n`
1003. `✅ Created app/api/qmoi-model.ts`
