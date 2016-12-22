<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class feedback_requests
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    private $provider_msg;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $is_accepted;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $visibility_criteria;

    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    private $requester_msg;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $request_for_the_position;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $provide_for_the_position;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $requested_as;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $provided_as;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $provided_at;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="requester_userFeedback_request")
     * @ORM\JoinColumn(name="requester_id", referencedColumnName="id", nullable=false)
     */
    private $feedback_requestRequester_user;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="provider_userFeedback_request")
     * @ORM\JoinColumn(name="provider_id", referencedColumnName="id", nullable=false)
     */
    private $feedback_requestProvider_user;
    
    /**
     * @var datetime $created_at
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created_at;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getProvider_msg() {
		return $this->provider_msg;
	}

	public function setProvider_msg($provider_msg) {
		$this->provider_msg = $provider_msg;
	}

	public function getIs_accepted() {
		return $this->is_accepted;
	}

	public function setIs_accepted($is_accepted) {
		$this->is_accepted = $is_accepted;
	}

	public function getVisibility_criteria() {
		return $this->visibility_criteria;
	}

	public function setVisibility_criteria($visibility_criteria) {
		$this->visibility_criteria = $visibility_criteria;
	}

	public function getRequester_msg() {
		return $this->requester_msg;
	}

	public function setRequester_msg($requester_msg) {
		$this->requester_msg = $requester_msg;
	}

	public function getRequest_for_the_position() {
		return $this->request_for_the_position;
	}

	public function setRequest_for_the_position($request_for_the_position) {
		$this->request_for_the_position = $request_for_the_position;
	}

	public function getProvide_for_the_position() {
		return $this->provide_for_the_position;
	}

	public function setProvide_for_the_position($provide_for_the_position) {
		$this->provide_for_the_position = $provide_for_the_position;
	}

	public function getRequested_as() {
		return $this->requested_as;
	}

	public function setRequested_as($requested_as) {
		$this->requested_as = $requested_as;
	}

	public function getProvided_as() {
		return $this->provided_as;
	}

	public function setProvided_as($provided_as) {
		$this->provided_as = $provided_as;
	}

	public function getProvided_at() {
		return $this->provided_at;
	}

	public function setProvided_at($provided_at) {
		$this->provided_at = $provided_at;
	}

	public function getFeedback_requestRequester_user() {
		return $this->feedback_requestRequester_user;
	}

	public function setFeedback_requestRequester_user($feedback_requestRequester_user) {
		$this->feedback_requestRequester_user = $feedback_requestRequester_user;
	}

	public function getFeedback_requestProvider_user() {
		return $this->feedback_requestProvider_user;
	}

	public function setFeedback_requestProvider_user($feedback_requestProvider_user) {
		$this->feedback_requestProvider_user = $feedback_requestProvider_user;
	}

	public function getCreated_at() {
		return $this->created_at;
	}

	public function setCreated_at($created_at) {
		$this->created_at = $created_at;
	}

}