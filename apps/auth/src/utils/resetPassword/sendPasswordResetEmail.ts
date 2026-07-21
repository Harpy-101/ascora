type SendPasswordResetVars = {
  to: string;
  resetUrl: string;
};

export default function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetVars) {
  console.log("Development password reset email:", {
    to,
    resetUrl,
  });
}
