<template>
    <div class="landing-page">
        <!-- Hero Section with Parallax Effect -->
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">Repo Manager</h1>
                <p class="hero-subtitle">Effortlessly manage repository access and contributors</p>
                <CommonButton 
                    class="hero-cta" 
                    type="primary" 
                    size="M"
                    @click="navigateToLogin"
                >
                    <template #default>Get Started</template>
                </CommonButton>
            </div>
            <div class="hero-parallax-bg"></div>
            <!-- Floating bubbles background -->
            <div class="floating-elements">
                <div class="bubble bubble-1" v-motion-slide-visible="{ distance: 80 }"></div>
                <div class="bubble bubble-2" v-motion-slide-visible="{ distance: 40 }"></div>
                <div class="bubble bubble-3" v-motion-slide-visible="{ distance: 60 }"></div>
                <div class="bubble bubble-4" v-motion-slide-visible="{ distance: 100 }"></div>
                <div class="bubble bubble-5" v-motion-slide-visible="{ distance: 50 }"></div>
            </div>
        </section>

        <!-- Features Section with Scroll Animations -->
        <section class="features-section">
            <h2 class="section-title">Powerful Repository Management</h2>
            
            <div class="feature-cards">
                <div class="feature-card" v-motion-slide-visible-once-bottom>
                    <div class="feature-icon time-icon"></div>
                    <h3>Time-Limited Access</h3>
                    <p>Set expiration dates for contributors and automatically revoke access when time is up</p>
                </div>
                
                <div class="feature-card" v-motion-slide-visible-once-bottom>
                    <div class="feature-icon group-icon"></div>
                    <h3>Group Management</h3>
                    <p>Organize contributors into groups with shared permissions and expiration dates</p>
                </div>
                
                <div class="feature-card" v-motion-slide-visible-once-bottom>
                    <div class="feature-icon token-icon"></div>
                    <h3>Invite Tokens</h3>
                    <p>Generate QR codes and shareable links for seamless GitHub integration</p>
                </div>
            </div>
        </section>

        <!-- How It Works Section with Scroll Animations -->
        <section class="how-it-works-section">
            <h2 class="section-title">How It Works</h2>
            
            <div class="steps-container">
                <div class="step" v-motion-fade-visible>
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Connect Your GitHub</h3>
                        <p>Sign in with your GitHub account to get started</p>
                    </div>
                </div>
                
                <div class="step" v-motion-fade-visible>
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Create Access Groups</h3>
                        <p>Organize contributors by project, class, or team with custom expiration dates</p>
                    </div>
                </div>
                
                <div class="step" v-motion-fade-visible>
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Share Invite Tokens</h3>
                        <p>Generate and share QR codes or links for contributors to join</p>
                    </div>
                </div>
                
                <div class="step" v-motion-fade-visible>
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h3>Automatic Management</h3>
                        <p>Let the system handle access expiration and permission updates</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- See It In Action Section with Apple-like Scrolling Effects -->
        <section class="showcase-section">
            <h2 class="section-title">See It In Action</h2>
            
            <!-- Dashboard Showcase -->
            <div class="showcase-item" v-motion-slide-visible>
                <div class="showcase-content">
                    <h3>Intuitive Dashboard</h3>
                    <p>Monitor all your repositories and contributor access from a single, powerful interface</p>
                </div>
                <div class="showcase-image-wrapper" v-motion-slide-visible="{ distance: 100 }">
                    <div class="showcase-image dashboard-image">
                        <div class="image-gradient"></div>
                    </div>
                </div>
            </div>
            
            <!-- Group Management Showcase -->
            <div class="showcase-item reverse" v-motion-slide-visible>
                <div class="showcase-image-wrapper" v-motion-slide-visible="{ distance: 100 }">
                    <div class="showcase-image group-image">
                        <div class="image-gradient"></div>
                    </div>
                </div>
                <div class="showcase-content">
                    <h3>Effortless Group Management</h3>
                    <p>Create, organize, and manage contributor groups with just a few clicks</p>
                </div>
            </div>
            
            <!-- Token Generation Showcase -->
            <div class="showcase-item" v-motion-slide-visible>
                <div class="showcase-content">
                    <h3>Secure Token Generation</h3>
                    <p>Generate and share secure access tokens with expiration dates and permission levels</p>
                </div>
                <div class="showcase-image-wrapper" v-motion-slide-visible="{ distance: 100 }">
                    <div class="showcase-image token-image">
                        <div class="image-gradient"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Call to Action Section -->
        <section class="cta-section">
            <div class="cta-content">
                <h2>Ready to streamline your repository management?</h2>
                <CommonButton 
                    class="cta-button" 
                    type="primary" 
                    size="M"
                    @click="navigateToLogin"
                >
                    <template #default>Get Started Now</template>
                </CommonButton>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import CommonButton from '~/components/common/CommonButton.vue';
import { colorsList } from '~/utils/styles';

const router = useRouter();

const navigateToLogin = () => {
    router.push('/login');
};
</script>

<style scoped lang="scss">
.landing-page {
    width: 100%;
    overflow-x: hidden;
    color: $lightgray0;
    background-color: $darkgray1000;

    section {
        padding: 80px 20px;
        max-width: 1200px;
        margin: 0 auto;

        @include mobile() {
            padding: 60px 16px;
        }
    }

    .section-title {
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 60px;
        background: linear-gradient(135deg, $primary700, $primary400);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;

        @include mobile() {
            font-size: 2rem;
            margin-bottom: 40px;
        }
    }

    // Hero Section
    .hero-section {
        position: relative;
        height: 100vh;
        min-height: 600px;
        max-height: 900px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        overflow: hidden;
        max-width: none;

        .hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 0 20px;
            max-width: 800px;
        }

        .hero-title {
            font-size: 4.5rem;
            font-weight: 800;
            margin-bottom: 20px;
            background: linear-gradient(135deg, $primary700, $primary400);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            transform: translateY(20px);
            opacity: 0;
            animation: fadeInUp 0.8s ease-out forwards;

            @include mobile() {
                font-size: 3rem;
            }
        }

        .hero-subtitle {
            font-size: 1.5rem;
            margin-bottom: 40px;
            color: $lightgray400;
            transform: translateY(20px);
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
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, varToRgba('darkgray950', 0.8), varToRgba('darkgray900', 0.8));
            z-index: 1;
            transform-style: preserve-3d;
            transform: translateZ(-10px) scale(2);
            will-change: transform;
        }
        
        // Floating bubbles
        .floating-elements {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 5;
            overflow: hidden;
        }
        
        .bubble {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(135deg, varToRgba('primary700', 0.1), varToRgba('primary400', 0.05));
            backdrop-filter: blur(5px);
            box-shadow: 0 8px 32px varToRgba('primary700', 0.1);
            will-change: transform;
            animation-duration: 20s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            
            &.bubble-1 {
                width: 180px;
                height: 180px;
                top: 15%;
                left: 10%;
                animation-name: float1;
            }
            
            &.bubble-2 {
                width: 120px;
                height: 120px;
                top: 60%;
                left: 15%;
                animation-name: float2;
            }
            
            &.bubble-3 {
                width: 200px;
                height: 200px;
                top: 25%;
                right: 15%;
                animation-name: float3;
            }
            
            &.bubble-4 {
                width: 100px;
                height: 100px;
                bottom: 20%;
                right: 20%;
                animation-name: float4;
            }
            
            &.bubble-5 {
                width: 150px;
                height: 150px;
                top: 40%;
                right: 30%;
                animation-name: float5;
            }
        }
    }

    // Features Section
    .features-section {
        background-color: varToRgba('darkgray950Raw', 0.5);
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
        background: $darkgray1000;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 10px 30px varToRgba('darkgray1000', 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px varToRgba('darkgray1000', 0.1);
        }

        h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 20px 0 15px;
            color: $lightgray100;
        }

        p {
            color: $lightgray100;
            line-height: 1.6;
        }
    }

    .feature-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
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
        background-color: $darkgray1000;
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
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, $primary700, $primary400);
        color: $lightgray0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        flex-shrink: 0;
        margin-right: 20px;
    }

    .step-content {
        h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: $lightgray100;
        }

        p {
            color: $lightgray400;
            line-height: 1.6;
        }
    }

    // Showcase Section (Apple-like)
    .showcase-section {
        background-color: varToRgba('darkgray950', 0.5);
        padding: 120px 20px;
        overflow: hidden;
        
        @include mobile() {
            padding: 80px 16px;
        }
    }

    .showcase-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 120px;
        position: relative;
        
        &:last-child {
            margin-bottom: 0;
        }
        
        &.reverse {
            flex-direction: row-reverse;
            
            .showcase-content {
                padding-left: 0;
                padding-right: 60px;
                
                @include tablet() {
                    padding-right: 0;
                    padding-top: 40px;
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
        flex: 0 0 40%;
        padding-left: 60px;
        z-index: 2;
        
        h3 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            background: linear-gradient(135deg, $primary700, $primary400);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            
            @include mobile() {
                font-size: 2rem;
            }
        }
        
        p {
            font-size: 1.2rem;
            line-height: 1.6;
            color: $lightgray400;
            max-width: 400px;
            
            @include mobile() {
                font-size: 1rem;
            }
        }
        
        @include tablet() {
            flex: 0 0 100%;
            padding-left: 0;
            padding-top: 40px;
            text-align: center;
            
            p {
                max-width: 100%;
            }
        }
    }
    
    .showcase-image-wrapper {
        flex: 0 0 60%;
        position: relative;
        height: 500px;
        overflow: hidden;
        border-radius: 24px;
        box-shadow: 0 30px 60px varToRgba('darkgray1000', 0.3);
        transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
        transition: transform 0.5s ease;
        will-change: transform;
        
        &:hover {
            transform: perspective(1000px) rotateY(-2deg) rotateX(2deg);
        }
        
        @include tablet() {
            flex: 0 0 100%;
            height: 400px;
            transform: perspective(1000px) rotateY(0) rotateX(5deg);
            
            &:hover {
                transform: perspective(1000px) rotateY(0) rotateX(2deg);
            }
        }
        
        @include mobile() {
            height: 300px;
        }
    }
    
    .showcase-image {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        position: relative;
        transition: transform 0.5s ease;
        will-change: transform;
        
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
        background: linear-gradient(135deg, varToRgba('primary700', 0.9), varToRgba('primary500', 0.9));
        text-align: center;
        padding: 100px 20px;
        max-width: none;

        .cta-content {
            max-width: 800px;
            margin: 0 auto;
        }

        h2 {
            color: $lightgray0;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 30px;

            @include mobile() {
                font-size: 2rem;
            }
        }

        .cta-button {
            --primary-color: #{$darkgray1000Orig};
            --hover-color: #{$darkgray950Orig};
            --focus-color: #{$darkgray900Orig};
            color: $primary700;
            font-weight: 600;
        }
    }

    // Animations
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
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


