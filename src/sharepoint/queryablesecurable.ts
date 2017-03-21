import { RoleAssignments } from "./roles";
import { Queryable, QueryableInstance } from "./queryable";

export class QueryableSecurable extends QueryableInstance {

    /**
     * Gets the set of role assignments for this item
     *
     */
    public get roleAssignments(): RoleAssignments {
        return new RoleAssignments(this);
    }

    /**
     * Gets the closest securable up the security hierarchy whose permissions are applied to this list item
     *
     */
    public get firstUniqueAncestorSecurableObject(): QueryableInstance {
        return new QueryableInstance(this, "FirstUniqueAncestorSecurableObject");
    }

    /**
     * Gets the effective permissions for the user supplied
     *
     * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
     */
    public getUserEffectivePermissions(loginName: string): Queryable {
        const perms = new Queryable(this, "getUserEffectivePermissions(@user)");
        perms.query.add("@user", "'" + encodeURIComponent(loginName) + "'");
        return perms;
    }

    /**
     * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
     *
     * @param copyRoleAssignments If true the permissions are copied from the current parent scope
     * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
     */
    public breakRoleInheritance(copyRoleAssignments = false, clearSubscopes = false): Promise<any> {

        return this.clone(QueryableSecurable, `breakroleinheritance(copyroleassignments=${copyRoleAssignments}, clearsubscopes=${clearSubscopes})`, true).post();
    }

    /**
     * Removes the local role assignments so that it re-inherit role assignments from the parent object.
     *
     */
    public resetRoleInheritance(): Promise<any> {

        return this.clone(QueryableSecurable, "resetroleinheritance", true).post();
    }
}
