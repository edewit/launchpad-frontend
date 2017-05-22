import {ForgeService} from "./forge.service";
import {Injectable} from "@angular/core";
import {History} from "../wizard/history.component";
import {Gui} from "./model";
import {CiDirective} from "./ci.directive";

@Injectable()
export class CachedForgeService extends ForgeService {
  private stepResult: string[] = [
    "{\"metadata\":{\"deprecated\":false,\"category\":\"Openshift.io\",\"name\":\"Deployment type\",\"description\":\"Choose the Deployment type for your booster\"},\"state\":{\"valid\":true,\"canExecute\":false,\"wizard\":true,\"canMoveToNextStep\":true,\"canMoveToPreviousStep\":false,\"steps\":[\"Deployment type\",\"Mission\",\"Runtime\",\"Project Info\"]},\"inputs\":[{\"name\":\"deploymentType\",\"shortName\":\" \",\"valueType\":\"io.openshift.launchpad.ui.booster.DeploymentType\",\"inputType\":\"org.jboss.forge.inputType.RADIO\",\"enabled\":true,\"required\":true,\"deprecated\":false,\"label\":\"Deployment type\",\"description\":\"\",\"valueChoices\":[{\"id\":\"Continuous delivery\",\"declaringClass\":\"class io.openshift.launchpad.ui.booster.DeploymentType\",\"description\":\"Continuous delivery\"},{\"id\":\"ZIP File\",\"declaringClass\":\"class io.openshift.launchpad.ui.booster.DeploymentType\",\"description\":\"ZIP File\"}],\"class\":\"UISelectOne\",\"value\":\"Continuous delivery\"}]}",
    "{\"metadata\":{\"deprecated\":false,\"category\":\"Openshift.io\",\"name\":\"Mission\",\"description\":\"Choose the Mission\"},\"state\":{\"valid\":true,\"canExecute\":false,\"wizard\":true,\"canMoveToNextStep\":true,\"canMoveToPreviousStep\":true,\"steps\":[\"Deployment type\",\"Mission\",\"Runtime\",\"Project Info\"]},\"inputs\":[{\"name\":\"mission\",\"shortName\":\" \",\"valueType\":\"io.openshift.launchpad.catalog.Mission\",\"inputType\":\"org.jboss.forge.inputType.DEFAULT\",\"enabled\":true,\"required\":true,\"deprecated\":false,\"label\":\"Mission\",\"description\":\"\",\"valueChoices\":[{\"id\":\"CRUD\",\"key\":\"crud\",\"name\":\"CRUD\"},{\"id\":\"Externalized Configuration\",\"key\":\"configmap\",\"name\":\"Externalized Configuration\"},{\"id\":\"Health Check\",\"key\":\"health-check\",\"name\":\"Health Check\"},{\"id\":\"REST API Level 0\",\"key\":\"rest-http\",\"name\":\"REST API Level 0\"},{\"id\":\"Secured\",\"key\":\"rest-http-secured\",\"name\":\"Secured\"}],\"class\":\"UISelectOne\",\"value\":\"CRUD\"}]}",
    "{\"metadata\":{\"deprecated\":false,\"category\":\"Openshift.io\",\"name\":\"Runtime\",\"description\":\"Choose the runtime for your mission\"},\"state\":{\"valid\":true,\"canExecute\":false,\"wizard\":true,\"canMoveToNextStep\":true,\"canMoveToPreviousStep\":true,\"steps\":[\"Deployment type\",\"Mission\",\"Runtime\",\"Project Info\"]},\"inputs\":[{\"name\":\"runtime\",\"shortName\":\" \",\"valueType\":\"io.openshift.launchpad.catalog.Runtime\",\"inputType\":\"org.jboss.forge.inputType.DEFAULT\",\"enabled\":true,\"required\":true,\"deprecated\":false,\"label\":\"Runtime\",\"description\":\"\",\"valueChoices\":[{\"id\":\"Spring Boot\",\"key\":\"spring-boot\",\"name\":\"Spring Boot\"},{\"id\":\"Vert.x\",\"key\":\"vert.x\",\"name\":\"Vert.x\"},{\"id\":\"WildFly Swarm\",\"key\":\"wildfly-swarm\",\"name\":\"WildFly Swarm\"}],\"class\":\"UISelectOne\",\"value\":\"Spring Boot\"}]}",
    "{\"metadata\":{\"deprecated\":false,\"category\":\"Openshift.io\",\"name\":\"Project Info\",\"description\":\"Project Information\"},\"state\":{\"valid\":false,\"canExecute\":false,\"wizard\":true,\"canMoveToNextStep\":false,\"canMoveToPreviousStep\":true,\"steps\":[\"Deployment type\",\"Mission\",\"Runtime\",\"Project Info\"]},\"inputs\":[{\"name\":\"named\",\"shortName\":\" \",\"valueType\":\"java.lang.String\",\"inputType\":\"org.jboss.forge.inputType.DEFAULT\",\"enabled\":true,\"required\":true,\"deprecated\":false,\"label\":\"OpenShift Project name\",\"description\":\"The following characters are accepted: -a-z0-9 and the name cannot start or end with a dash\",\"class\":\"UIInput\"},{\"name\":\"gitHubRepositoryName\",\"shortName\":\" \",\"valueType\":\"java.lang.String\",\"inputType\":\"org.jboss.forge.inputType.DEFAULT\",\"enabled\":true,\"required\":false,\"deprecated\":false,\"label\":\"GitHub Repository Name\",\"description\":\"\",\"note\":\"If empty, it will assume the project name\",\"class\":\"UIInput\"},{\"name\":\"groupId\",\"shortName\":\" \",\"valueType\":\"java.lang.String\",\"inputType\":\"org.jboss.forge.inputType.DEFAULT\",\"enabled\":true,\"required\":true,\"deprecated\":false,\"label\":\"Group Id\",\"description\":\"\",\"class\":\"UIInput\",\"value\":\"io.openshift.booster\"},{\"name\":\"artifactId\",\"shortName\":\" \",\"valueType\":\"java.lang.String\",\"inputType\":\"org.jboss.forge.inputType.DEFAULT\",\"enabled\":true,\"required\":true,\"deprecated\":false,\"label\":\"Artifact Id\",\"description\":\"\",\"class\":\"UIInput\",\"value\":\"booster-crud-spring-boot\"},{\"name\":\"version\",\"shortName\":\" \",\"valueType\":\"java.lang.String\",\"inputType\":\"org.jboss.forge.inputType.DEFAULT\",\"enabled\":true,\"required\":true,\"deprecated\":false,\"label\":\"Version\",\"description\":\"\",\"class\":\"UIInput\",\"value\":\"1.0.0-SNAPSHOT\"}]}"
  ];

  commandInfo(command: string): Promise<Gui> {
    return Promise.resolve(JSON.parse(this.stepResult[0]));
  }

  nextStep(command: string, history: History): Promise<Gui> {
    let gui = JSON.parse(this.stepResult[history.stepIndex]);
    if (history.stepIndex === 3 && !CiDirective.isCiChosen(history)) {
      gui.inputs.splice(0, 2);
      gui.state.canExecute = true;
    }
    return Promise.resolve(gui);
  }
}
