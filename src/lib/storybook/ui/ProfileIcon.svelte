<script lang="ts">
import type { User } from '$lib/selectModels/user';

export let user: User | undefined;
</script>

<div class="profile-icon">
    <a href={`/u/${user?.Profile?.screenName}`}
        ><img class="icon" src={user?.Profile?.icon} alt="profile" /></a
    >
</div>

<style lang="scss">
.profile-icon {
    flex-shrink: 0;
    .icon {
        border-radius: 100%;
    }
}
</style>
