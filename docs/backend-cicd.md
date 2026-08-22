# Backend CI/CD

الملف المسؤول عن الـ pipeline هو:

`.github/workflows/deploy-backend.yml`

الهدف منه إن أي تغيير في الـ backend يمر بمرحلة فحص واختبار قبل ما يتنشر على الـ VPS.

## الفرق بين CI و CD

`CI` معناها Continuous Integration. هنا بنستخدمها علشان نتأكد إن الكود بيتثبت، مفيهوش أخطاء syntax واضحة، والاختبارات بتعدي.

`CD` معناها Continuous Deployment. هنا بنستخدمها علشان ننشر الكود على السيرفر بعد نجاح الـ CI.

## متى يشتغل الـ workflow؟

```yaml
on:
  push:
    branches:
      - main
```

ده معناه إن الـ workflow يشتغل لما يحصل push على branch اسمه `main`.

```yaml
    paths:
      - "portfolio-backend/**"
      - ".github/workflows/deploy-backend.yml"
```

ده بيخلي الـ workflow يشتغل فقط لو التغيير لمس backend أو ملف الـ workflow نفسه.

```yaml
  pull_request:
    branches:
      - main
```

ده بيشغل مرحلة الـ CI على أي Pull Request داخل على `main`.

```yaml
  workflow_dispatch:
```

ده بيسمح لك تشغل الـ workflow يدويًا من GitHub Actions.

## Job: Backend CI

```yaml
ci:
  name: Backend CI
  runs-on: ubuntu-latest
```

ده أول job. بيشتغل على Linux runner من GitHub.

```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

ده بينزل نسخة من الكود داخل runner عشان باقي الأوامر تشتغل عليها.

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
    cache-dependency-path: portfolio-backend/package-lock.json
```

ده بيجهز Node.js version 20، ويفعل cache لـ npm اعتمادًا على `package-lock.json`.

```yaml
- name: Install dependencies
  working-directory: portfolio-backend
  run: npm ci
```

`working-directory` معناها إن الأمر هيتنفذ داخل فولدر `portfolio-backend`.

`npm ci` بيثبت dependencies من `package-lock.json` بشكل ثابت ومناسب للـ CI.

```yaml
- name: Check JavaScript syntax
  working-directory: portfolio-backend
  run: npm run syntax:check
```

ده بيشغل script موجود في `portfolio-backend/package.json`.

الـ script بيستخدم `node --check` علشان يتأكد إن ملفات JavaScript الأساسية مفيهاش syntax errors.

```yaml
- name: Run backend tests
  working-directory: portfolio-backend
  run: npm test
```

ده بيشغل اختبارات الـ backend باستخدام Node test runner.

الاختبارات الحالية موجودة في:

`portfolio-backend/tests/api.test.js`

وهي بتراجع:

- `GET /api/health` بيرجع status سليم.
- `POST /api/auth/login` بيرفض login ناقص username/password.
- Routes التعديل في portfolio بترفض الطلبات بدون token.

## Job: Deploy Backend

```yaml
deploy:
  name: Deploy Backend
  runs-on: ubuntu-latest
  needs: ci
```

`needs: ci` معناها إن deploy مش هيبدأ غير لو Backend CI نجح.

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

ده يمنع deploy من التشغيل على Pull Requests. النشر يحصل فقط بعد push حقيقي على `main`.

```yaml
- name: Deploy to VPS
  uses: appleboy/ssh-action@v1.2.2
```

ده GitHub Action بيفتح SSH على الـ VPS وينفذ أوامر النشر.

```yaml
host: ${{ secrets.VPS_HOST }}
username: ${{ secrets.VPS_USERNAME }}
key: ${{ secrets.VPS_SSH_KEY }}
```

دي GitHub Secrets. لازم تكون متضافة في repo settings، وممنوع تتحط في الكود.

## أوامر النشر داخل السيرفر

```bash
cd /home/mahmoud/apps/Portfolio
```

يدخل فولدر المشروع على الـ VPS.

```bash
git fetch origin
```

يسحب آخر معلومات من remote repository.

```bash
git reset --hard origin/main
```

يخلي نسخة السيرفر مطابقة تمامًا لـ `origin/main`.

```bash
cd portfolio-backend
```

يدخل فولدر الـ backend.

```bash
npm ci --omit=dev
```

يثبت dependencies المطلوبة للتشغيل فقط، بدون devDependencies.

```bash
pm2 restart portfolio-api
```

يعيد تشغيل backend process المسجل في PM2 باسم `portfolio-api`.

```bash
sleep 3
```

ينتظر 3 ثواني عشان السيرفر يلحق يقوم بعد restart.

```bash
curl -f http://127.0.0.1:5000/api/health
```

يتأكد إن backend رجع يرد. لو endpoint فشل، خطوة deploy نفسها تفشل في GitHub Actions.

## Admin Credentials

الكود لم يعد يحتوي على admin ثابت مثل `admin/admin123`.

بدل ذلك، الـ backend ينشئ أول admin من environment variables:

```bash
ADMIN_USERNAME=admin@gmail.com
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=<your-secure-password>
JWT_SECRET=<long-random-secret>
MONGODB_URI=<your-mongodb-uri>
```

ضع القيم دي في بيئة تشغيل الـ VPS أو في ecosystem file الخاص بـ PM2. لا تكتب كلمة المرور داخل GitHub أو داخل ملفات المشروع.

بعد أول تشغيل، لو المستخدم موجود بالفعل، الكود لن يعيد إنشاءه.

## أوامر مفيدة محليًا

من داخل `portfolio-backend`:

```bash
npm ci
npm run syntax:check
npm test
```

ومن داخل `portfolio-fronend`:

```bash
npm ci
npm run build
```
