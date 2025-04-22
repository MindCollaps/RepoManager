<template>
    <div class="landing-page">
        <!-- Hero Section with Parallax Effect -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">Repo Manager</h1>
                <p class="hero-subtitle">Effortlessly manage repository access and contributors</p>
                <common-button
                    class="hero-cta"
                    size="M"
                    type="primary"
                    @click="navigateToLogin"
                >
                    <template #default>Get Started</template>
                </common-button>
            </div>
            <div class="hero-parallax-bg"/>
            <!-- Floating bubbles background -->
            <div class="floating-elements">
                <div
                    v-motion-slide-visible="{ distance: 80 }"
                    class="bubble bubble-1"
                />
                <div
                    v-motion-slide-visible="{ distance: 40 }"
                    class="bubble bubble-2"
                />
                <div
                    v-motion-slide-visible="{ distance: 60 }"
                    class="bubble bubble-3"
                />
                <div
                    v-motion-slide-visible="{ distance: 100 }"
                    class="bubble bubble-4"
                />
                <div
                    v-motion-slide-visible="{ distance: 50 }"
                    class="bubble bubble-5"
                />
            </div>
        </section>

        <!-- Features Section with Scroll Animations -->
        <section class="features-section">
            <h2 class="section-title">Powerful Repository Management</h2>

            <div class="feature-cards">
                <div
                    v-motion-slide-visible-once-bottom
                    class="feature-card"
                >
                    <div class="feature-icon time-icon"/>
                    <h3>Time-Limited Access</h3>
                    <p>Set expiration dates for contributors and automatically revoke access when time is up</p>
                </div>

                <div
                    v-motion-slide-visible-once-bottom
                    class="feature-card"
                >
                    <div class="feature-icon group-icon"/>
                    <h3>Group Management</h3>
                    <p>Organize contributors into groups with shared permissions and expiration dates</p>
                </div>

                <div
                    v-motion-slide-visible-once-bottom
                    class="feature-card"
                >
                    <div class="feature-icon token-icon"/>
                    <h3>Invite Tokens</h3>
                    <p>Generate QR codes and shareable links for seamless GitHub integration</p>
                </div>
            </div>
        </section>

        <!-- How It Works Section with Scroll Animations -->
        <section class="how-it-works-section">
            <h2 class="section-title">How It Works</h2>

            <div class="steps-container">
                <div
                    v-motion-fade-visible
                    class="step"
                >
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Connect Your GitHub</h3>
                        <p>Sign in with your GitHub account to get started</p>
                    </div>
                </div>

                <div
                    v-motion-fade-visible
                    class="step"
                >
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Create Access Groups</h3>
                        <p>Organize contributors by project, class, or team with custom expiration dates</p>
                    </div>
                </div>

                <div
                    v-motion-fade-visible
                    class="step"
                >
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Share Invite Tokens</h3>
                        <p>Generate and share QR codes or links for contributors to join</p>
                    </div>
                </div>

                <div
                    v-motion-fade-visible
                    class="step"
                >
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h3>Automatic Management</h3>
                        <p>Let the system handle access expiration and permission updates</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- See It In Action Section -->
        <section class="showcase-section">
            <h2 class="section-title">See It In Action</h2>

            <!-- Dashboard Showcase -->
            <div
                v-motion-slide-visible
                class="showcase-item"
            >
                <div class="showcase-content">
                    <h3>Intuitive Dashboard</h3>
                    <p>Monitor all your repositories and contributor access from a single, powerful interface</p>
                </div>
                <div
                    v-motion-slide-visible="{ distance: 100 }"
                    class="showcase-image-wrapper"
                >
                    <div class="showcase-image dashboard-image">
                        <div class="image-gradient"/>
                    </div>
                </div>
            </div>

            <!-- Group Management Showcase -->
            <div
                v-motion-slide-visible
                class="showcase-item reverse"
            >
                <div
                    v-motion-slide-visible="{ distance: 100 }"
                    class="showcase-image-wrapper"
                >
                    <div class="showcase-image group-image">
                        <div class="image-gradient"/>
                    </div>
                </div>
                <div class="showcase-content">
                    <h3>Effortless Group Management</h3>
                    <p>Create, organize, and manage contributor groups with just a few clicks</p>
                </div>
            </div>

            <!-- Token Generation Showcase -->
            <div
                v-motion-slide-visible
                class="showcase-item"
            >
                <div class="showcase-content">
                    <h3>Secure Token Generation</h3>
                    <p>Generate and share secure access tokens with expiration dates and permission levels</p>
                </div>
                <div
                    v-motion-slide-visible="{ distance: 100 }"
                    class="showcase-image-wrapper"
                >
                    <div class="showcase-image token-image">
                        <div class="image-gradient"/>
                    </div>
                </div>
            </div>
        </section>

        <!-- Call to Action Section -->
        <section class="cta-section">
            <div class="cta-content">
                <h2>Ready to streamline your repository management?</h2>
                <common-button
                    class="cta-button"
                    size="M"
                    type="primary"
                    @click="navigateToLogin"
                >
                    <template #default>Get Started Now</template>
                </common-button>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import CommonButton from '~/components/common/CommonButton.vue';

const router = useRouter();

const navigateToLogin = () => {
    router.push('/login');
};
</script>

<style scoped lang="scss">
.landing-page {
    overflow-x: hidden;
    width: 100%;
    color: $lightgray0;
    background-color: $darkgray1000;

    section {
        margin: 0 auto;
        padding: 80px 20px;

        @include mobile() {
            padding: 60px 16px;
        }
    }

    .section-title {
        margin-bottom: 60px;

        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;

        background: linear-gradient(135deg, $primary700, $primary400);
        background-clip: text;

        -webkit-text-fill-color: transparent;

        @include mobile() {
            margin-bottom: 40px;
            font-size: 2rem;
        }
    }

    // Hero Section
    .hero-section {
        position: relative;

        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        max-width: none;
        height: 100vh;
        min-height: 600px;
        max-height: 900px;
        padding: 0;

        .hero-content {
            position: relative;
            z-index: 10;

            max-width: 800px;
            padding: 0 20px;

            text-align: center;
        }

        .hero-title {
            transform: translateY(20px);

            margin-bottom: 20px;

            font-size: 4.5rem;
            font-weight: 800;

            opacity: 0;
            background: linear-gradient(135deg, $primary700, $primary400);
            background-clip: text;

            animation: fadeInUp 0.8s ease-out forwards;

            -webkit-text-fill-color: transparent;

            @include mobile() {
                font-size: 3rem;
            }
        }

        .hero-subtitle {
            transform: translateY(20px);

            margin-bottom: 40px;

            font-size: 1.5rem;
            color: $lightgray400;

            opacity: 0;

            animation: fadeInUp 0.8s ease-out 0.2s forwards;

            @include mobile() {
                font-size: 1.2rem;
            }
        }

        .hero-cta {
            transform: translateY(20px);
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.4s forwards;
        }

        .hero-parallax-bg {
            will-change: transform;

            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            transform-style: preserve-3d;
            transform: translateZ(-10px) scale(2);

            width: 100%;
            height: 100%;

            background: linear-gradient(135deg, varToRgba('darkgray950', 0.8), varToRgba('darkgray900', 0.8));
        }

        // Floating bubbles
        .floating-elements {
            position: absolute;
            z-index: 5;
            top: 0;
            left: 0;

            overflow: hidden;

            width: 100%;
            height: 100%;
        }

        .bubble {
            will-change: transform;

            position: absolute;

            border-radius: 50%;

            background: linear-gradient(135deg, varToRgba('primary700', 0.1), varToRgba('primary400', 0.05));
            backdrop-filter: blur(5px);

            animation-duration: 20s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;

            &.bubble-1 {
                top: 15%;
                left: 10%;

                width: 180px;
                height: 180px;

                animation-name: float1;
            }

            &.bubble-2 {
                top: 60%;
                left: 15%;

                width: 120px;
                height: 120px;

                animation-name: float2;
            }

            &.bubble-3 {
                top: 25%;
                right: 15%;

                width: 200px;
                height: 200px;

                animation-name: float3;
            }

            &.bubble-4 {
                right: 20%;
                bottom: 20%;

                width: 100px;
                height: 100px;

                animation-name: float4;
            }

            &.bubble-5 {
                top: 40%;
                right: 30%;

                width: 150px;
                height: 150px;

                animation-name: float5;
            }
        }
    }

    // Features Section
    .features-section {
        padding-right: 512px;
        padding-left: 512px;
    }

    .feature-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;

        @include tablet() {
            grid-template-columns: repeat(2, 1fr);
        }

        @include mobileOnly() {
            grid-template-columns: 1fr;
        }
    }

    .feature-card {
        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 30px;
        border-radius: 16px;

        text-align: center;

        box-shadow: 5px 8px 5px varToRgba('darkgray1000', 0.05);

        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 7px 10px 6px varToRgba('darkgray1000', 0.05);
        }

        h3 {
            margin: 20px 0 15px;
            font-size: 1.5rem;
            font-weight: 600;
            color: $lightgray100;
        }

        p {
            line-height: 1.6;
            color: $lightgray100;
        }
    }

    .feature-icon {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 80px;
        height: 80px;
        margin-bottom: 20px;
        border-radius: 50%;

        background-color: varToRgba('primary500', 0.1);

        &.time-icon {
            background-color: varToRgba('primary500', 0.5);
        }

        &.group-icon {
            background-color: varToRgba('success500', 0.5);
        }

        &.token-icon {
            background-color: varToRgba('info500', 0.5);
        }
    }

    // How It Works Section
    .how-it-works-section {
        background-color: $darkgray950;
    }

    .steps-container {
        max-width: 800px;
        margin: 0 auto;
    }

    .step {
        display: flex;
        align-items: flex-start;
        margin-bottom: 50px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .step-number {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;

        width: 50px;
        height: 50px;
        margin-right: 20px;
        border-radius: 50%;

        font-size: 1.5rem;
        font-weight: 700;
        color: $lightgray0;

        background: linear-gradient(135deg, $primary700, $primary400);
    }

    .step-content {
        h3 {
            margin-bottom: 10px;
            font-size: 1.5rem;
            font-weight: 600;
            color: $lightgray100;
        }

        p {
            line-height: 1.6;
            color: $lightgray400;
        }
    }

    // Showcase Section
    .showcase-section {
        overflow: hidden;
        padding: 120px 20px;
        padding-right: 350px;
        padding-left: 350px;

        @include mobile() {
            padding: 80px 16px;
        }
    }

    .showcase-item {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-bottom: 120px;

        &:last-child {
            margin-bottom: 0;
        }

        &.reverse {
            flex-direction: row-reverse;

            .showcase-content {
                padding-right: 60px;
                padding-left: 0;

                @include tablet() {
                    padding-top: 40px;
                    padding-right: 0;
                }
            }
        }

        @include tablet() {
            flex-direction: column;
            margin-bottom: 100px;

            &.reverse {
                flex-direction: column;
            }
        }
    }

    .showcase-content {
        z-index: 2;
        flex: 0 0 40%;
        padding-left: 60px;

        h3 {
            margin-bottom: 20px;

            font-size: 2.5rem;
            font-weight: 700;

            background: linear-gradient(135deg, $primary700, $primary400);
            background-clip: text;

            -webkit-text-fill-color: transparent;

            @include mobile() {
                font-size: 2rem;
            }
        }

        p {
            max-width: 400px;
            font-size: 1.2rem;
            line-height: 1.6;
            color: $lightgray400;

            @include mobile() {
                font-size: 1rem;
            }
        }

        @include tablet() {
            flex: 0 0 100%;
            padding-top: 40px;
            padding-left: 0;
            text-align: center;

            p {
                max-width: 100%;
            }
        }
    }

    .showcase-image-wrapper {
        will-change: transform;

        position: relative;
        transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);

        overflow: hidden;
        flex: 0 0 60%;

        height: 500px;
        border-radius: 24px;

        transition: transform 0.5s ease;

        &:hover {
            transform: perspective(1000px) rotateY(-2deg) rotateX(2deg);
        }

        @include tablet() {
            transform: perspective(1000px) rotateY(0) rotateX(5deg);
            flex: 0 0 100%;
            height: 400px;

            &:hover {
                transform: perspective(1000px) rotateY(0) rotateX(2deg);
            }
        }

        @include mobile() {
            height: 300px;
        }
    }

    .showcase-image {
        will-change: transform;

        position: relative;

        width: 100%;
        height: 100%;

        background-position: center;
        background-size: cover;

        transition: transform 0.5s ease;

        &:hover {
            transform: scale(1.05);
        }

        &.dashboard-image {
            background: linear-gradient(135deg, varToRgba('primary700', 0.8), varToRgba('primary500', 0.8));
        }

        &.group-image {
            background: linear-gradient(135deg, varToRgba('success700', 0.8), varToRgba('success500', 0.8));
        }

        &.token-image {
            background: linear-gradient(135deg, varToRgba('info700', 0.8), varToRgba('info500', 0.8));
        }

        .image-gradient {
            position: absolute;
            top: 0;
            left: 0;

            width: 100%;
            height: 100%;

            background: radial-gradient(circle at center, transparent 30%, varToRgba('darkgray1000', 0.5) 100%);
        }
    }

    // CTA Section
    .cta-section {
        max-width: none;
        padding: 100px 20px;
        text-align: center;
        background: linear-gradient(135deg, varToRgba('primary700', 0.9), varToRgba('primary500', 0.9));

        .cta-content {
            max-width: 800px;
            margin: 0 auto;
        }

        h2 {
            margin-bottom: 30px;
            font-size: 2.5rem;
            font-weight: 700;
            color: $lightgray0;

            @include mobile() {
                font-size: 2rem;
            }
        }

        .cta-button {
            --primary-color: #{$darkgray1000Orig};
            --focus-color: #{$darkgray900Orig};
            font-weight: 600;
            color: $primary700;
        }
    }

    // Animations
    @keyframes fadeInUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }

        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes float1 {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(20px, 15px); }
        50% { transform: translate(-10px, 30px); }
        75% { transform: translate(-25px, 10px); }
    }

    @keyframes float2 {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-15px, 20px); }
        50% { transform: translate(10px, 25px); }
        75% { transform: translate(20px, -10px); }
    }

    @keyframes float3 {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-20px, -15px); }
        50% { transform: translate(15px, -25px); }
        75% { transform: translate(10px, 15px); }
    }

    @keyframes float4 {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(15px, -20px); }
        50% { transform: translate(-10px, -15px); }
        75% { transform: translate(-20px, 10px); }
    }

    @keyframes float5 {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(10px, 15px); }
        50% { transform: translate(20px, -10px); }
        75% { transform: translate(-15px, -20px); }
    }
}
</style>


