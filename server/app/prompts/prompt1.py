# prompt1.py
PROMPT1 = {
    (
        "login",
        "signin",
        "sign in",
        "log in",
    ): """
    To sign in to MOSDAC:
    1. Visit https://mosdac.gov.in/realms/Mosdac/protocol/openid-connect/auth?response_type=code&scope=openid%20email&client_id=mosdac&state=1MtmYv6fMoIC8sO5xOe_DzuS3MI&redirect_uri=https%3A%2F%2Fmosdac.gov.in%2Fuops%2Fredirect_uri&nonce=rLzyd-ukwHrWp04lt19ZZfFvXDY00vUy9E8SMMoUGiY
    2. Fill in your email/username and password.
    3. Confirm your email through the verification link (if logging in for the 1st time).
    """,
    (
        "register",
        "signup",
        "sign up",
        "create account",
    ): """
    To create a new MOSDAC account:
    1. Visit https://mosdac.gov.in/signup
    2. Fill in your name, email, organization, purpose, password, etc.
    3. Wait for sometime, it will take maybe 1-2 days for MOSDAC(ISRO) to confirm and accept your account.
    """,
}
