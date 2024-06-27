<script>
import { Const } from '@/utils/constants';
import axios from 'axios';
import { Toast } from 'bootstrap/dist/js/bootstrap.bundle';

export default {
    props: {
        userId: {
            required: true
        }
    },


    data() {
        return {
            formData: {
                name: '',
                email: '',
                oldPassword: '',
                newPassword: '',
            },

            loading: false,
            formSubmitted: false,
            toastElement: null
        };
    },

    watch: {
        userId: {
            immediate: true,
            handler: 'fetchUser'
        }
    },

    mounted() {
        this.toastElement = new Toast(document.getElementById('password-toast'));
    },

    methods: {
        showToastMessage(message) {
            const toastEl = document.getElementById('password-toast');
            toastEl.querySelector('.password-toast-body').textContent = message;
            this.toastElement.show();
        },

        async fetchUser(userId) {
            try {
                var config = {
                    method: 'get',
                    url: `${Const.BASE_URL}users/${userId}`,
                    headers: {
                        'access-token': localStorage.getItem('accessToken')
                    },
                }
                const res = await axios.request(config)
                const user = res.data.user

                this.formData.name = user?.name
                this.formData.email = user?.email
                return
            } catch (error) {
                console.error(error)
            }
        },
        async handleSubmit() {
            try {
                this.loading = true
                const payload = {
                    userId: this.userId,
                    oldPassword: this.formData.oldPassword,
                    password: this.formData.newPassword
                }

                var config = {
                    method: 'get',
                    url: `${Const.BASE_URL}users/password/change`,
                    data: payload,
                    headers: {
                        'access-token': localStorage.getItem('accessToken')
                    },
                }

                const res = await axios.request(config)
                if (res.data.status !== 200) throw new Error
                this.showToastMessage('Password Updated Succesfully')
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            } catch (error) {
                console.error(error)
                this.showToastMessage('Failed to update password. Please try again')
            } finally {
                this.loading = false

            }
        },
    },


};
</script>



<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="mb-3 col-md-6">
                            <label for="passwordName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="passwordName" v-model="formData.name">
                        </div>

                        <div class="mb-3 col-md-6">
                            <label for="passwordEmail" class="form-label">Email</label>
                            <input type="email" class="form-control" id="passwordEmail" v-model="formData.email">
                        </div>

                        <div class="mb-3 col-md-6">
                            <label for="oldPassword" class="form-label">Old Password</label>
                            <input type="password" class="form-control" id="oldPassword" v-model="formData.oldPassword"
                                required>
                        </div>

                        <div class="mb-3 col-md-6">
                            <label for="newPassword" class="form-label">New Password</label>
                            <input type="password" class="form-control" id="newPassword" v-model="formData.newPassword"
                                required>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" :disabled="loading"><span
                            v-if="loading">Submitting...</span>
                        <span v-if="!loading">Submit</span>
                    </button>
                </div>

            </div>
        </form>

        <div class="position-absolute top-0 start-50 translate-middle-x p-3" style="z-index: 11">
            <div id="password-toast" class="toast align-items-center" role="alert" aria-live="assertive"
                aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body password-toast-body"></div>
                    <button type="button" class="btn-close ms-auto me-2" aria-label="Close" @click="hideToast"></button>
                </div>
            </div>
        </div>

    </div>
</template>



<style>
.form {
    display: flex;
    flex-direction: column;

}
</style>