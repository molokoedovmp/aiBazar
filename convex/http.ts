// import { httpRouter, httpAction } from "convex/server";
// import { api } from "./_generated/api";

// const http = httpRouter();

// http.route({
//   path: "/yookassa-webhook",
//   method: "POST",
//   handler: httpAction(async (ctx, request) => {
//     const payload = await request.json();
//     const event = payload.event;
//     const payment = payload.object;

//     if (event === "payment.succeeded") {
//       await ctx.runMutation(api.payments.updateStatus, {
//         paymentId: payment.id,
//         status: "succeeded",
//       });
//     } else if (event === "payment.canceled") {
//       await ctx.runMutation(api.payments.updateStatus, {
//         paymentId: payment.id,
//         status: "canceled",
//       });
//     }

//     return new Response(null, { status: 200 });
//   }),
// });

// export default http;
